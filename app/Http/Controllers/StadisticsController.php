<?php
//estadisticas de registros
// Route::middleware(['auth', 'admin'])->group(function () {

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function index()
    {
        $userCount = User::count();
        $newUsersLastMonth = User::where('created_at', '>=', now()->subMonth())->count();

        return view('admin.statistics.index', compact('userCount', 'newUsersLastMonth'));
    }
}
