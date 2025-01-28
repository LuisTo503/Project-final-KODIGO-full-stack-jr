<?
namespace Database\Factories;

use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class SessionFactory extends Factory
{
    protected $model = Session::class;

    public function definition()
    {
        return [
            'id' => Str::random(40),
            'user_id' => \App\Models\User::factory(),
            'ip_address' => $this->faker->ipv4,
            'user_agent' => $this->faker->userAgent,
            'payload' => base64_encode(json_encode(['_token' => Str::random(40)])),
            'last_activity' => now()->timestamp,
        ];
    }
}
