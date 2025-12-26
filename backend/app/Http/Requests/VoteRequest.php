<?php

namespace App\Http\Requests;

use App\Models\Vote;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class VoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'candidate_id' => 'required|exists:candidates,id',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Check if email has already voted
            $hasVoted = Vote::where('email', $this->email)->exists();

            if ($hasVoted) {
                $validator->errors()->add('email', 'Email ini sudah melakukan voting');
            }
        });
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'candidate_id.required' => 'Kandidat wajib dipilih',
            'candidate_id.exists' => 'Kandidat tidak ditemukan',
        ];
    }
}
