import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Store, ArrowLeft } from 'lucide-react';

export const PharmacyLogin: React.FC = () => {
  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for auth session on mount and when URL changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Get pharmacy details from localStorage (set during magic link request)
        const pharmacyId = localStorage.getItem('tempPharmacyId');
        const pharmacyName = localStorage.getItem('tempPharmacyName');
        
        if (pharmacyId && pharmacyName) {
          // Move from temp storage to permanent
          localStorage.setItem('pharmacyId', pharmacyId);
          localStorage.setItem('pharmacyName', pharmacyName);
          localStorage.removeItem('tempPharmacyId');
          localStorage.removeItem('tempPharmacyName');
          
          toast.success('Login successful!');
          navigate('/pharmacy/dashboard');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if the pharmacy exists
      const { data: pharmacyData, error: pharmacyError } = await supabase
        .from('pharmacies')
        .select('*')
        .eq('name', pharmacyName)
        .single();

      console.log('Pharmacy data:', pharmacyData);
      console.log('Pharmacy error:', pharmacyError);

      if (pharmacyError) {
        throw new Error('Pharmacy not found');
      }

      if (!email) {
        throw new Error('Please enter your email address');
      }

      // Store pharmacy data in temp storage
      localStorage.setItem('tempPharmacyId', pharmacyData.id);
      localStorage.setItem('tempPharmacyName', pharmacyData.name);

      // Send magic link
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/pharmacy/dashboard',
          data: {
            pharmacy_id: pharmacyData.id,
            pharmacy_name: pharmacyData.name,
            role: 'pharmacy'
          }
        }
      });

      console.log('Magic link options:', {
        emailRedirectTo: window.location.origin + '/pharmacy/dashboard',
        data: {
          pharmacy_id: pharmacyData.id,
          pharmacy_name: pharmacyData.name,
          role: 'pharmacy'
        }
      });

      if (magicLinkError) {
        console.error('Magic link error:', magicLinkError);
        throw magicLinkError;
      }

      setMagicLinkSent(true);
      toast.success('Magic link sent! Check your email to continue.');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Store className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a magic link to {email}. Click the link in your email to sign in.
          </p>
          <div className="mt-4 text-center">
            <button
              onClick={() => setMagicLinkSent(false)}
              className="text-blue-600 hover:text-blue-500"
            >
              Use a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-4 left-4">
        <Link
          to="/"
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Store className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Pharmacy Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your pharmacy dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="pharmacyName" className="block text-sm font-medium text-gray-700">
                Pharmacy Name
              </label>
              <div className="mt-1">
                <input
                  id="pharmacyName"
                  name="pharmacyName"
                  type="text"
                  required
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your pharmacy name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                We'll send you a magic link to sign in
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending magic link...' : 'Send Magic Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
