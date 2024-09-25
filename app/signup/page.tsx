'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebaseconfig';
import { doc, setDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false,
  });

  // Validazione della password
  const validatePassword = (password: string) => {
    const length = password.length >= 8 && password.length <= 20;
    const upperCase = /[A-Z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[@$!%*?&#.^&]/.test(password);

    setPasswordValid({ length, upperCase, number, specialChar });
  };

  // Verifica se tutti i criteri della password sono soddisfatti
  const isPasswordValid = Object.values(passwordValid).every(Boolean);

  // Validazione dell'email
  const isEmailValid = (email: string) => {
    // Controlla che l'email sia valida con una regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const formValidation =
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !confirmPass.trim() ||
    !isEmailValid(email);

  // Funzione per controllare se le password coincidono
  const passwordsMatch = password === confirmPass;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setError(null);

    if (formValidation || !passwordsMatch) {
      setError('Le password non corrispondono o alcuni campi non sono validi.');
      toast.error('Le password non corrispondono o alcuni campi non sono validi.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        active: true,
      });

      toast.success('Registrazione effettuata con successo!');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('auth/email-already-in-use')) {
          setError('Email non utilizzabile. Prova a effettuare il login.');
          toast.error('Email non utilizzabile. Prova a effettuare il login.');
          return;

        } else {
          setError(error.message);
          toast.error(error.message);
          return;
        }
      } else {
        setError('Si &egrave; verificato un errore sconosciuto.');
        toast.error('Si &egrave; verificato un errore sconosciuto.');
        return;
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg  p-6">
        <h1 className="text-4xl font-titolo text-rosso mb-6">Registrati</h1>
        {error && (
          <div className="mb-4 p-4 border-l-4 border-red-500 bg-red-50 text-red-700 ">
            <strong className="font-semibold">Error:</strong>
            <p>{error}</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="border-b border-gray-900/10 pb-8">
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Nome
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="first-name"
                      name="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full  border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Nome"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Cognome
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="last-name"
                      name="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Cognome"
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full  border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${!isEmailValid(email) && email.trim() ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 ${!isEmailValid(email) && email.trim() ? 'focus:ring-red-500' : 'focus:ring-indigo-600'} sm:text-sm`}
                      placeholder="Email"
                    />
                    {!isEmailValid(email) && email.trim() && (
                      <p className="text-red-600 text-sm mt-1">Inserisci un&apos;email valida.</p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="block w-full  border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Password"
                    />
                    {/* Messaggio di validazione password, visibile solo quando non tutti i criteri sono soddisfatti */}
                    {passwordFocused && !isPasswordValid && (
                      <div className="absolute top-full mt-1 w-full bg-white border  shadow-md p-4">
                        <p className={`text-sm ${passwordValid.length ? 'text-green-600' : 'text-red-600'}`}>Da 8 a 20 caratteri</p>
                        <p className={`text-sm ${passwordValid.upperCase ? 'text-green-600' : 'text-red-600'}`}>Una lettera maiuscola</p>
                        <p className={`text-sm ${passwordValid.number ? 'text-green-600' : 'text-red-600'}`}>Un numero</p>
                        <p className={`text-sm ${passwordValid.specialChar ? 'text-green-600' : 'text-red-600'}`}>Un carattere speciale</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`sm:col-span-6 ${isPasswordValid ? 'block' : 'hidden'}`}>
                  <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                    Conferma Password
                  </label>
                  <div className="mt-2">
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="block w-full  border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Conferma Password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-x-6">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => router.push('/')}>
                Annulla
              </button>
              <button
                type="submit"
                className={`border-2 border-rosso bg-white text-rosso p-2 hover:bg-rosso hover:text-white font-bold ${formValidation ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={formValidation}
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
        <ToastContainer containerId="toastSignUp" />
      </div>
    </div>
  );
}
