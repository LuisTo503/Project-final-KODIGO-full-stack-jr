<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductController extends Controller
{
    /**
* @OA\Get(
*     path="/api/products",
*     summary="Get All Products",
*     tags={"Products"},
*     @OA\Response(response="200", description="List of all products")
* )
*/

    function index() {
        return response()->json(Product::all(), 200);
    }

    /**
* @OA\Get(
*     path="/api/products/{id}",
*     summary="Get Product by ID",
*     tags={"Products"},
*     @OA\Parameter(
*         name="id",
*         in="path",
*         required=true,
*         @OA\Schema(type="integer")
*     ),
*     @OA\Response(response="200", description="Product details"),
*     @OA\Response(response="404", description="Product not found")
* )
*/

    function show($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        return response()->json($product, 200);
    }


    /**
* @OA\Post(
*     path="/api/products",
*     summary="Create Product",
*     tags={"Products"},
*     @OA\RequestBody(
*         @OA\MediaType(
*             mediaType="multipart/form-data",
*             @OA\Schema(
*                 required={"name", "description", "price", "stock", "image"},
*                 @OA\Property(property="name", type="string"),
*                 @OA\Property(property="description", type="string"),
*                 @OA\Property(property="price", type="number"),
*                 @OA\Property(property="stock", type="integer"),
*                 @OA\Property(property="image", type="string", format="binary")
*             )
*         )
*     ),
*     @OA\Response(response="201", description="Product created successfully")
* )
*/

    function store(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|numeric',
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePictureUrl = null;
        if ($request->hasFile('image')) {
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
            $imagePictureUrl = $uploadedFileUrl;
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => $imagePictureUrl,
        ]);

        return response()->json($product, 201);
    }


    /**
* @OA\Put(
*     path="/api/products/{id}",
*     summary="Update Product",
*     tags={"Products"},
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
*                 required={"name", "description", "price", "stock"},
*                 @OA\Property(property="name", type="string"),
*                 @OA\Property(property="description", type="string"),
*                 @OA\Property(property="price", type="number"),
*                 @OA\Property(property="stock", type="integer"),
*                 @OA\Property(property="image", type="string", format="binary")
*             )
*         )
*     ),
*     @OA\Response(response="200", description="Product updated successfully"),
*     @OA\Response(response="404", description="Product not found")
* )
*/

    function update(Request $request, $id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validationRules = [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|numeric',
        ];

        // Solo validamos la imagen si se envió una nueva
        if ($request->hasFile('image')) {
            $validationRules['image'] = 'image|mimes:jpg,jpeg,png|max:2048';
        }

        $request->validate($validationRules);

        $data = $request->only(['name', 'description', 'price', 'stock']);
        
        if ($request->hasFile('image')) {
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath())->getSecurePath();
            $data['image'] = $uploadedFileUrl;
        }

        $product->update($data);
        return response()->json($product, 200);
    }

    /**
* @OA\Delete(
*     path="/api/products/{id}",
*     summary="Delete Product",
*     tags={"Products"},
*     @OA\Parameter(
*         name="id",
*         in="path",
*         required=true,
*         @OA\Schema(type="integer")
*     ),
*     @OA\Response(response="200", description="Product deleted successfully"),
*     @OA\Response(response="404", description="Product not found")
* )
*/

    function destroy($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}