<?php

namespace App\Http\Controllers;

use App\Models\User;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    
    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Get All Users",
     *     tags={"Users"},
     *     @OA\Response(response="200", description="List of all users")
     * )
     */
    
    public function index()
    {
        return response()->json(User::all(), 200);
    }


    /**
 * @OA\Get(
 *     path="/api/users/{id}",
 *     summary="Get User by ID",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(response="200", description="User details"),
 *     @OA\Response(response="404", description="User not found")
 * )
 */

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json($user, 200);
    }




    /**
 * @OA\Put(
 *     path="/api/users/{id}",
 *     summary="Update User",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 @OA\Property(property="name", type="string"),
 *                 @OA\Property(property="email", type="string", format="email"),
 *                 @OA\Property(property="password", type="string", format="password"),
 *                 @OA\Property(property="profile_picture", type="string", format="binary")
 *             )
 *         )
 *     ),
 *     @OA\Response(response="200", description="User updated successfully"),
 *     @OA\Response(response="404", description="User not found")
 * )
 */

    
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'profile_picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->only(['name', 'email']);

        // Actualizar contraseña si se proporciona
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        // Actualizar imagen de perfil si se proporciona
        if ($request->hasFile('profile_picture')) {
            $uploadedFileUrl = Cloudinary::upload($request->file('profile_picture')->getRealPath())->getSecurePath();
            $data['profile_picture'] = $uploadedFileUrl;
        }

        $user->update($data);

        return response()->json($user, 200);
    }


    /**
 * @OA\Put(
 *     path="/api/users/{id}/role",
 *     summary="Update User Role",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="role_id", type="integer")
 *         )
 *     ),
 *     @OA\Response(response="200", description="Role updated successfully"),
 *     @OA\Response(response="404", description="User not found")
 * )
 */

    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $request->validate([
            'role_id' => 'required|integer|in:1,2,3',
        ]);

        $user->update(['role_id' => $request->role_id]);

        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $user
        ], 200);
    }




    /**
 * @OA\Delete(
 *     path="/api/users/{id}",
 *     summary="Delete User",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(response="200", description="User deleted successfully"),
 *     @OA\Response(response="404", description="User not found")
 * )
 */
    
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted'], 200);
    }


    /**
 * @OA\Put(
 *     path="/api/users/{id}/info",
 *     summary="Update User Information",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         @OA\MediaType(
 *             mediaType="multipart/form-data",
 *             @OA\Schema(
 *                 @OA\Property(property="name", type="string"),
 *                 @OA\Property(property="email", type="string", format="email"),
 *                 @OA\Property(property="profile_picture", type="string", format="binary")
 *             )
 *         )
 *     ),
 *     @OA\Response(response="200", description="User information updated successfully"),
 *     @OA\Response(response="404", description="User not found")
 * )
 */

    public function updateInfo(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    $request->validate([
        'name' => 'sometimes|required|string',
        'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        'profile_picture' => 'sometimes|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $data = $request->only(['name', 'email']);

    if ($request->hasFile('profile_picture')) {
        $uploadedFileUrl = Cloudinary::upload($request->file('profile_picture')->getRealPath())->getSecurePath();
        $data['profile_picture'] = $uploadedFileUrl;
    }

    $user->update($data);

    return response()->json([
        'message' => 'Información actualizada',
        'user' => $user
    ], 200);
}


/**
 * @OA\Put(
 *     path="/api/users/{id}/password",
 *     summary="Update User Password",
 *     tags={"Users"},
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="current_password", type="string"),
 *             @OA\Property(property="new_password", type="string"),
 *             @OA\Property(property="new_password_confirmation", type="string")
 *         )
 *     ),
 *     @OA\Response(response="200", description="Password updated successfully"),
 *     @OA\Response(response="401", description="Current password incorrect")
 * )
 */

public function updatePassword(Request $request, $id)
{
    $request->validate([
        'current_password' => 'required|string',
        'new_password' => 'required|string|min:6|confirmed',
    ]);

    $user = User::find($id);
    
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json(['error' => 'Contraseña actual incorrecta'], 401);
    }

    $user->update([
        'password' => Hash::make($request->new_password)
    ]);

    return response()->json(['message' => 'Contraseña actualizada'], 200);
}
}
