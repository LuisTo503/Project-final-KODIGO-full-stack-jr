<?php
namespace App\Http\Controllers;
use App\Models\Comentario;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    /**
     * Get all comments with optional filtering
     * GET /api/comentario
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'producto_id' => 'sometimes|integer|exists:products,id',
                'usuario_id' => 'sometimes|integer|exists:users,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Error de validación',
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Comentario::with([
                'usuario:id,name,profile_picture',
                'producto:id,name,image'
            ]);

            if ($request->has('producto_id')) {
                $query->where('producto_id', $request->producto_id);
            }

            if ($request->has('usuario_id')) {
                $query->where('usuario_id', $request->usuario_id);
            }

            $comentarios = $query->orderBy('fecha', 'desc')->paginate(10);

            // Asegurar que el método index del controlador retorne:
            return response()->json([
                'message' => 'Comentarios obtenidos exitosamente',
                'data' => $comentarios->items() // Devuelve solo los ítems del paginador
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific comment by ID
     * GET /api/comentario/{id}
     */
    public function show($id)
    {
        try {
            $comentario = Comentario::with(['usuario:id,name', 'producto:id,name'])->find($id);

            if (!$comentario) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            return response()->json([
                'message' => 'Comment retrieved successfully',
                'data' => $comentario
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new comment
     * POST /api/comentario
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'contenido' => 'required|string|max:255',
                'calificacion' => 'required|integer|min:1|max:5',
                'fecha' => 'required|date',
                'usuario_id' => 'required|exists:users,id',
                'producto_id' => 'required|exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 400);
            }

            $validated = $validator->validated();

            $comentario = Comentario::create($validated);

            return response()->json([
                'message' => 'Comment created successfully',
                'data' => $comentario
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing comment
     * PUT /api/comentario/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $comentario = Comentario::find($id);

            if (!$comentario) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'contenido' => 'sometimes|string|max:255',
                'calificacion' => 'sometimes|integer|min:1|max:5',
                'fecha' => 'sometimes|date',
                'usuario_id' => 'sometimes|exists:users,id',
                'producto_id' => 'sometimes|exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 400);
            }

            $validated = $validator->validated();
            $comentario->update($validated);

            return response()->json([
                'message' => 'Comment updated successfully',
                'data' => $comentario
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a comment
     * DELETE /api/comentario/{id}
     */
    public function destroy($id)
    {
        try {
            $comentario = Comentario::find($id);

            if (!$comentario) {
                return response()->json([
                    'message' => 'Comment not found'
                ], 404);
            }

            $comentario->delete();

            return response()->json([
                'message' => 'Comment deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show form for creating a new comment (if needed for web routes)
     */
    public function create()
    {
        // This method would be used if you need a web form
        // For API purposes, this can remain empty
    }

    /**
     * Show form for editing a comment (if needed for web routes)
     */
    public function edit($id)
    {
        // This method would be used if you need a web form
        // For API purposes, this can remain empty
    }
}