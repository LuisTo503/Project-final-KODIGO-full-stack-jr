<?php



namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        \App\Models\User::factory(10)->create();
        \App\Models\Product::factory(10)->create();
        \App\Models\Role::factory(10)->create();
        \App\Models\Session::factory(10)->create();
    }
}


?>
