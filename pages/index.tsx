import { useState, FormEvent } from 'react';
import { supabase } from '../client';
import React from 'react';

export default function SignIn() {
  const [email, setEmail] = useState<string>(''); // State for email as a string
  const [error, setError] = useState<string | null>(null); // State for error as a string or null
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message as string or null
  const [isSending, setIsSending] = useState<boolean>(false); // State for isSending as boolean

  // Sign in function with event type FormEvent
  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSending(true);

    const { error } = await supabase.auth.signIn({
      email, 
      options: {
        shouldCreateUser: false,
      }
    });

    setIsSending(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Check your email for the magic link to sign in!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100 lg:justify-center">
      <div className="flex flex-col overflow-hidden bg-white rounded-md shadow-lg max md:flex-row md:flex-1 lg:max-w-screen-md">
        <div className="p-4 py-6 text-white bg-white-500 md:w-80 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
          <img 
            src="data:image/jpeg;base64,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" // Update with your image path
            alt="Logo" 
            className="w-[5rem] h-[5rem] max-w-xs mx-auto mb-4 rounded-full" 
          />
          <div className="my-3 text-4xl text-gray-800 font-bold tracking-wider text-center">
            <a href="#">AYANWORKS</a>
          </div>
          <p className="mt-5 font-small text-sm/[15px] text-center text-gray-800 md:mt-0">
            Employee Portal For To Get Credential <br></br>In Their Wallet
          </p>
        </div>
        <div className="p-5 bg-white md:flex-1">
          <h3 className="my-4 text-2xl font-semibold text-gray-700">Account Login</h3>
          <form action="#" className="flex flex-col space-y-5" onSubmit={signIn}>
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold text-gray-500">Email address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200" 
                required 
                disabled={isSending} 
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>} 
            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
            <div>
              <button 
                type="submit" 
                disabled={!email || isSending} 
                className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-gray-800 rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-orange-200 focus:ring-4">
                {isSending ? (
                  <div className="flex justify-center items-center">
                    <span className="mr-2">Sending...</span>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : 'Send Magic Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
