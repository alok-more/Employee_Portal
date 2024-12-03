
// pages/profile.js
// import React, { useState, useEffect } from 'react';
// import { supabase } from '../client';
// import { useRouter } from 'next/router';
// import Popup from 'reactjs-popup';
// import { QRCode } from 'react-qrcode-logo';
// import 'reactjs-popup/dist/index.css';

// export default function Profile() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [employeeData, setEmployeeData] = useState(null);
//   const [credentialData, setCredentialData] = useState([]);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [invitationUrl, setInvitationUrl] = useState('');
//   const [isHelpOpen, setIsHelpOpen] = useState(false);
//   const router = useRouter();


//   const colors = [
//     'bg-gradient-to-r from-gray-700 to-gray-900',
//     'bg-gradient-to-r from-teal-800 to-cyan-900',
//     'bg-gradient-to-r from-yellow-600 to-red-700',
//     'bg-gradient-to-r from-pink-700 to-orange-700',
//     'bg-gradient-to-r from-green-900 to-blue-900',
//   ];

//   const templateColorMap = {}; 

//   const getColorForCredential = (templateName) => {
//     if (!templateColorMap[templateName]) {
//       const availableColor = colors[Object.keys(templateColorMap).length % colors.length];
//       templateColorMap[templateName] = availableColor;
//     }
//     return templateColorMap[templateName];
//   };

//   const toggleHelp = () => {
//     setIsHelpOpen(!isHelpOpen);
//   };

//   const toggleDropdown = () => setDropdownOpen((prev) => !prev);

//   const fetchProfile = async () => {
//     const profileData = await supabase.auth.user();
//     if (!profileData) {
//       router.push('/sign-in');
//       return;
//     }
//     setProfile(profileData);
//     await getEmployee(profileData.email);
//     await callExternalApi(profileData.email);
//   };

//   const getEmployee = async (email) => {
//     try {
//       const { data, error } = await supabase
//         .from("Employee_Details")
//         .select()
//         .eq('Email', email)
//         .single();

//       if (error) throw error;
//       setEmployeeData(data);

//       if (data) {
//         await getCredentialSchema(data.Enterprise_Id);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   const getCredentialSchema = async (enterpriseId) => {
//     try {
//       const { data, error } = await supabase
//         .from("Credential_Table")
//         .select("Credential_json, Template:Template_Id(*, Organization:Org_Id(*))")
//         .eq('Enterprise_Id', enterpriseId);
//       console.log("🚀 ~ getCredentialSchema ~ data:", data)

//       if (error) throw error;
//       setCredentialData(data || []);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   const callExternalApi = async (email) => {
//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}token`, {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ clientSecret: `${process.env.NEXT_PUBLIC_CLIENT_SECRET}` }),
//       });

//       const data = await response.json();
//       const token = data.data?.access_token;
//       if (token) {
//         localStorage.setItem('token', token);
//       }
//     } catch (error) {
//       console.error("API Call Error:", error);
//     }
//   };

//   const handlePostCredential = async (credential) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('Token not found in local storage');
//       return;
//     }

//     const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}credentials/oob/offer?credentialType=jsonld`;
//     const requestBody = {
//       isShortenUrl: true,
//       autoAcceptCredential: "always",
//       credential: credential.Credential_json.credential,
//       options: {
//         proofType: "EcdsaSecp256k1Signature2019",
//         proofPurpose: "assertionMethod"
//       }
//     };
//     console.log("🚀 ~ handlePostCredential ~ requestBody:", requestBody)

//     try {
//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'accept': 'application/json',
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(requestBody)
//       });
//       console.log("🚀 ~ handlePostCredential ~ response:", response)

//       if (!response.ok) {
//         throw new Error(`Failed to send credential: ${response.statusText}`);
//       }

//       const result = await response.json();
//       setInvitationUrl(result.data.invitationUrl);
//       setIsPopupOpen(true); // Open popup

//     } catch (error) {
//       console.error('Error sending credential:', error);
//     }
//   };

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Logout Error:", error);
//     } else {
//       router.push('/sign-in'); 
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   if (!profile) return null;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 md:px-6 md:py-3">
//         {/* Logo and Nav Section */}
//         <div className="flex items-center">
//           <img
//             className="w-[2.5rem] h-[2.5rem] rounded-full mr-2 md:w-[3rem] md:h-[3rem]"
//             src="data:image/jpeg;base64,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"
//             alt="Logo"
//           />
//           <nav className="text-white font-bold text-base italic md:text-lg">AYANWORKS</nav>
//         </div>

//         {/* Profile Section */}
//         <div className="relative">
//           <div className="flex items-center space-x-2 md:space-x-3">
//             <p className="hidden sm:block text-white font-medium text-xs sm:text-sm md:text-base">{profile.email}</p>
//             <button
//               className="flex items-center justify-center w-[2rem] h-[2rem] rounded-full bg-yellow-400 text-black font-semibold md:w-[2.5rem] md:h-[2.5rem]"
//               onClick={toggleDropdown}
//             >
//               <img
//                 src="https://www.svgrepo.com/show/495590/profile-circle.svg"
//                 width={40}
//                 height={40}
//                 style={{ borderRadius: 20 }}
//                 alt="Profile"
//               />
//             </button>
//           </div>

//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-2">
//               <button
//                 className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 md:px-4 md:py-2 md:text-base"
//                 onClick={handleLogout}
//               >
//                 Sign out
//               </button>
//             </div>
//           )}
//         </div>
//       </header>


//       {/* Main content */}
//       <main className="mx-auto px-4 sm:px-10 max-w-full my-0 text-center">
//         <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-4'>
//           <h2 className="text-xl font-semibold mb-4">Manage Your Credentials Here</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {credentialData.map((credential, index) => {
//               const colorClass = getColorForCredential(credential.Template.Template_Name);

//               return (
//                 <div
//                   key={index}
//                   className={`${colorClass} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden
//                           w-full max-w-[450px] mx-auto`}
//                 >
//                   {/* Card Content */}
//                   <div className="absolute top-2 left-0 w-full h-14 bg-black bg-opacity-20 text-white-800"></div>
//                   <p className="text-white text-[21px] font-bold mb-3">{credential.Template.Template_Name}</p>
//                   <p className="text-white text-gray-400 text-base mb-6">{credential.Template.Organization.Org_Name}</p>

//                   <button
//                     className={`bg-white text-black font-semibold py-2 px-4 rounded-lg 
//                             hover:bg-gradient-to-l hover:from-white hover:to-gray-400 transition duration-300`}
//                     onClick={() => handlePostCredential(credential)}
//                   >
//                     Get Your Credential
//                   </button>
//                   <div className="absolute bottom-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mb-12"></div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* QR Code Popup */}
//           <Popup
//             open={isPopupOpen}
//             onClose={() => setIsPopupOpen(false)}
//             closeOnDocumentClick
//             modal
//             className="qr-popup"
//             contentStyle={{ borderRadius: '10px', padding: '20px', backgroundColor: '#1F2937' }}
//           >
//             <div className="text-center text-white flex flex-col items-center justify-center">
//               <h3 className="text-lg md:text-xl font-semibold mb-4">Scan this QR Code to get your Credential</h3>
//               {invitationUrl && (
//                 <div className="flex justify-center mb-4">
//                   <QRCode 
//                     logoWidth={60} 
//                     logoHeight={60} 
//                     eyeRadius={20} 
//                     logoImage="" 
//                     value={invitationUrl} 
//                     size={window.innerWidth < 640 ? 150 : 200} 
//                   />
//                 </div>
//               )}
//               <button
//                 className="bg-white bg-opacity-100 text-black font-bold py-2 px-4 mt-4 rounded hover:bg-white-100 transition"
//                 onClick={() => setIsPopupOpen(false)}
//               >
//                 Close
//               </button>
//             </div>
//           </Popup>


//           {/* Help & Hints Button and Panel */}
//           <button
//             onClick={toggleHelp}
//             className="fixed right-0 bottom-8 px-3 py-2 bg-gray-600 text-white rounded-l-full cursor-pointer z-50 flex items-center justify-center shadow-xl hover:bg-gray-700 transition-colors duration-200"
//           >
//             Help & Hints
//           </button>
//           <div
//             className={`
//               bg-gray-100 p-5 shadow-lg overflow-y-auto
//               fixed top-0 bottom-0 right-0 w-80 sm:w-96
//               transition-transform duration-300 ease-in-out
//               ${isHelpOpen ? "translate-x-0" : "translate-x-full"}
//               z-40
//               border-l border-gray-300
//             `}
//           >
//             <h2 className="text-xl font-semibold mb-5">Steps To Get Your Credential</h2>
//             <div className="text-sm" style={{marginBottom: '8px'}}>
//               {/* <p>Steps To Get Your Credential</p> */}
//             </div>
//             <div>
//               <ul className='text-sm' style={{ listStyle: 'bullet', paddingLeft: '0' }}>
//                 <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
//                   Download the <b>ADEYA SSI App from</b> 
//                   <a href='https://play.google.com/store/apps/details?id=id.credebl.adeya&pli=1' style={{color:'darkblue'}}> Android Play Store</a> 
//                  <span></span> or 
//                   <a href='https://apps.apple.com/in/app/adeya-ssi-wallet/id6463845498' style={{color:'darkblue'}}> iOS App Store</a>.<br></br> (Skip, if already downloaded)
//                 </li>

//                 <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '20px 0' }}>
//                   <a href='https://play.google.com/store/apps/details?id=id.credebl.adeya&pli=1'>
//                     <img src='https://freelogopng.com/images/all_img/1664287128google-play-store-logo-png.png' style={{height:'45px', width:'140px'}} />
//                   </a>
//                   <a href='https://apps.apple.com/in/app/adeya-ssi-wallet/id6463845498'>
//                     <img src='https://w7.pngwing.com/pngs/506/939/png-transparent-app-store-logo-iphone-app-store-get-started-now-button-electronics-text-telephone-call.png' style={{height:'45px', width:'135px'}} />
//                   </a>
//                 </div>

//                 <li style={{ marginBottom: '8px', marginLeft: '10px' }}>Complete the onboarding process in ADEYA.</li>
//                 <li style={{ marginBottom: '8px', marginLeft: '10px' }}>Scan the QA code generated in portal.</li>
//                 <li style={{ marginBottom: '8px', marginLeft: '10px' }}> <b>Accept</b> the Credential in ADEYA.</li>
//                 <li style={{ marginBottom: '8px', marginLeft: '10px' }}>Check <b>"Credentials"</b> tab in ADEYA to view the issued credential.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





import React, { useState, useEffect } from 'react';
import { supabase } from '../client';
import { useRouter } from 'next/router';
import Popup from 'reactjs-popup';
import { QRCode } from 'react-qrcode-logo';
import 'reactjs-popup/dist/index.css';

// Interfaces to define the expected structure of the data
interface Profile {
  email: string;
  id: string;
}

interface EmployeeData {
  Email: string;
  Enterprise_Id: string;
  [key: string]: any; // Allow dynamic properties to be used in the object
}

interface Credential {
  Credential_json: {
    credential: string;
  };
  Template: {
    Template_Name: string;
    Organization: {
      Org_Name: string;
    };
  };
}

const ProfilePage: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [credentialData, setCredentialData] = useState<Credential[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [invitationUrl, setInvitationUrl] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const router = useRouter();

  const colors = [
    'bg-gradient-to-r from-gray-700 to-gray-900',
    'bg-gradient-to-r from-teal-800 to-cyan-900',
    'bg-gradient-to-r from-yellow-600 to-red-700',
    'bg-gradient-to-r from-pink-700 to-orange-700',
    'bg-gradient-to-r from-green-900 to-blue-900',
  ];

  const templateColorMap: { [key: string]: string } = {};

  const getColorForCredential = (templateName: string): string => {
    if (!templateColorMap[templateName]) {
      const availableColor = colors[Object.keys(templateColorMap).length % colors.length];
      templateColorMap[templateName] = availableColor;
    }
    return templateColorMap[templateName];
  };

  const toggleHelp = (): void => {
    setIsHelpOpen(!isHelpOpen);
  };

  const toggleDropdown = (): void => setDropdownOpen((prev) => !prev);

  const fetchProfile = async (): Promise<void> => {
    const profileData = await supabase.auth.user();
    if (!profileData) {
      router.push('/sign-in');
      return;
    }
    setProfile(profileData);
    await getEmployee(profileData.email);
    await callExternalApi(profileData.email);
  };

  const getEmployee = async (email: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('Employee_Details')
        .select()
        .eq('Email', email)
        .single();

      if (error) throw error;
      setEmployeeData(data);

      if (data) {
        await getCredentialSchema(data.Enterprise_Id);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const getCredentialSchema = async (enterpriseId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('Credential_Table')
        .select('Credential_json, Template:Template_Id(*, Organization:Org_Id(*))')
        .eq('Enterprise_Id', enterpriseId);

      if (error) throw error;
      setCredentialData(data || []);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const callExternalApi = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}token`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientSecret: `${process.env.NEXT_PUBLIC_CLIENT_SECRET}` }),
      });

      const data = await response.json();
      const token = data.data?.access_token;
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('API Call Error:', error);
    }
  };

  const handlePostCredential = async (credential: Credential): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token not found in local storage');
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}credentials/oob/offer?credentialType=jsonld`;
    const requestBody = {
      isShortenUrl: true,
      autoAcceptCredential: 'always',
      credential: credential.Credential_json.credential,
      options: {
        proofType: 'EcdsaSecp256k1Signature2019',
        proofPurpose: 'assertionMethod',
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to send credential: ${response.statusText}`);
      }

      const result = await response.json();
      setInvitationUrl(result.data.invitationUrl);
      setIsPopupOpen(true); // Open popup
    } catch (error) {
      console.error('Error sending credential:', error);
    }
  };

  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout Error:', error);
    } else {
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="w-full flex items-center justify-between px-4 py-2 bg-gray-800 md:px-6 md:py-3">
        <div className="flex items-center">
          <img
            className="w-[2.5rem] h-[2.5rem] rounded-full mr-2 md:w-[3rem] md:h-[3rem]"
            src="data:image/jpeg;base64,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"
            alt="Logo"
          />
          <nav className="text-white font-bold text-base italic md:text-lg">AYANWORKS</nav>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-2 md:space-x-3">
            <p className="hidden sm:block text-white font-medium text-xs sm:text-sm md:text-base">{profile.email}</p>
            <button
              className="flex items-center justify-center w-[2rem] h-[2rem] rounded-full bg-yellow-400 text-black font-semibold md:w-[2.5rem] md:h-[2.5rem]"
              onClick={toggleDropdown}
            >
              <img
                src="https://www.svgrepo.com/show/495590/profile-circle.svg"
                width={40}
                height={40}
                style={{ borderRadius: 20 }}
                alt="Profile"
              />
            </button>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg py-2">
              <button
                className="block w-full px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 transition duration-200 md:px-4 md:py-2 md:text-base"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-10 max-w-full my-0 text-center">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-4">
          <h2 className="text-xl font-semibold mb-4">Manage Your Credentials Here</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentialData.map((credential, index) => {
              const colorClass = getColorForCredential(credential.Template.Template_Name);

              return (
                <div
                  key={index}
                  className={`${colorClass} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden w-full max-w-[450px] mx-auto`}
                >
                  <div className="absolute top-2 left-0 w-full h-14 bg-black bg-opacity-20 text-white-800"></div>
                  <p className="text-white text-[21px] font-bold mb-3">{credential.Template.Template_Name}</p>
                  <p className="text-white text-gray-400 text-base mb-6">{credential.Template.Organization.Org_Name}</p>

                  <button
                    className="bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-gradient-to-l hover:from-white hover:to-gray-400 transition duration-300"
                    onClick={() => handlePostCredential(credential)}
                  >
                    Get Your Credential
                  </button>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mr-12 -mb-12"></div>
                </div>
              );
            })}
          </div>

          <Popup
            open={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            closeOnDocumentClick
            modal
            className="qr-popup"
            contentStyle={{ borderRadius: '10px', padding: '20px', backgroundColor: '#1F2937' }}
          >
            <div className="text-center text-white flex flex-col items-center justify-center">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Scan this QR Code to get your Credential</h3>
              {invitationUrl && (
                <div className="flex justify-center mb-4">
                  <QRCode
                    logoWidth={60}
                    logoHeight={60}
                    eyeRadius={20}
                    logoImage=""
                    value={invitationUrl}
                    size={window.innerWidth < 640 ? 150 : 200}
                  />
                </div>
              )}
              <button
                className="bg-white bg-opacity-100 text-black font-bold py-2 px-4 mt-4 rounded hover:bg-white-100 transition"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </Popup>

          <button
            onClick={toggleHelp}
            className="fixed right-0 bottom-8 px-3 py-2 bg-gray-600 text-white rounded-l-full cursor-pointer z-50 flex items-center justify-center shadow-xl hover:bg-gray-700 transition-colors duration-200"
          >
            Help & Hints
          </button>
          <div
            className={`
              bg-gray-100 p-5 shadow-lg overflow-y-auto
              fixed top-0 bottom-0 right-0 w-80 sm:w-96
              transition-transform duration-300 ease-in-out
              ${isHelpOpen ? 'translate-x-0' : 'translate-x-full'}
              z-40
              border-l border-gray-300
            `}
          >
            <h2 className="text-xl font-semibold mb-5">Steps To Get Your Credential</h2>
            <div className="text-sm" style={{ marginBottom: '8px' }}></div>
            <div>
              <ul className="text-sm" style={{ listStyle: 'bullet', paddingLeft: '0' }}>
                <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
                  Download the <b>ADEYA SSI App from</b>
                  <a
                    href="https://play.google.com/store/apps/details?id=id.credebl.adeya&pli=1"
                    style={{ color: 'darkblue' }}
                  >
                    {' '}
                    Android Play Store
                  </a>{' '}
                  or
                  <a
                    href="https://apps.apple.com/in/app/adeya-ssi-wallet/id6463845498"
                    style={{ color: 'darkblue' }}
                  >
                    {' '}
                    iOS App Store
                  </a>
                  .<br />
                  (Skip if already downloaded)
                </li>

                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    margin: '20px 0',
                  }}
                >
                  <a href="https://play.google.com/store/apps/details?id=id.credebl.adeya&pli=1">
                    <img
                      src="https://freelogopng.com/images/all_img/1664287128google-play-store-logo-png.png"
                      style={{ height: '45px', width: '140px' }}
                    />
                  </a>
                  <a href="https://apps.apple.com/in/app/adeya-ssi-wallet/id6463845498">
                    <img
                      src="https://w7.pngwing.com/pngs/506/939/png-transparent-app-store-logo-iphone-app-store-get-started-now-button-electronics-text-telephone-call.png"
                      style={{ height: '45px', width: '135px' }}
                    />
                  </a>
                </div>

                <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
                  Complete the onboarding process in ADEYA.
                </li>
                <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
                  Scan the QR code generated in the portal.
                </li>
                <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
                  <b>Accept</b> the Credential in ADEYA.
                </li>
                <li style={{ marginBottom: '8px', marginLeft: '10px' }}>
                  Check <b>"Credentials"</b> tab in ADEYA to view the issued credential.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
