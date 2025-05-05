"use client";

import { useSession } from "next-auth/react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

import useUser from "@/contexts/user";
import { Label } from "@/components/ui/label";
import { fetchCustom, formatDateForInput } from "@/lib/utils";
import InputComp from "@/components/Utils/Input";
import { Textarea } from "@/components/ui/textarea";
import { PenBoxIcon } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Image from "next/image";
import UploadFileToAWS from "@/components/Utils/UploadFileToAWS";
import { useUser } from "@/contexts/user";

export default function EditPersonalInfo({ personalInfo, forProfile = false }) {
  const { data: session, update } = useSession();
  const user = useUser();
  const [isEditing, setIsEditing] = useState(!forProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState(personalInfo);
  const { setUser } = useUser();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      if (!details?.firstName) {
        toast({
          variant: "destructive",
          description: "First name cannot be left empty",
        });
        return;
      }
      const newPersonalInfoData = {
        ...details,
        personalInfoId: details?._id,
      };

      const response = await fetchCustom("/user/personal", {
        method: "PUT",
        body: JSON.stringify(newPersonalInfoData),
        token: user?.token,
      });
      const data = await response.json();
      if (data?.success) {
        setUser({
          ...user,
          personalInfo: details,
        });
        toast({
          variant: "custom",
          description: data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          description: data?.message,
        });
      }
    } catch (error) {
      console.error("Error updating user personal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleEdit = async () => {
  //   setIsLoading(true);
  //   try {
  //     if (!details?.firstName) {
  //       toast({
  //         variant: "destructive",
  //         description: "First name cannot be left empty",
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     const response = await fetchCustom("/user/personal", {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         ...details,
  //         personalInfoId: details?._id,
  //       }),
  //       token: user?.token,
  //     });

  //     const data = await response.json();

  //     if (data?.success) {
  //       // ✅ Update state immediately to reflect the new data
  //       setDetails((prev) => ({
  //         ...prev,
  //         ...data.data, // Ensure `data.data` contains updated info
  //       }));

  //       toast({
  //         variant: "custom",
  //         description: data?.message,
  //       });

  //       // ✅ Force update of session if using NextAuth
  //       if (user?.update) {
  //         await user.update({
  //           user: {
  //             ...user,
  //             personalInfo: {
  //               ...user.personalInfo,
  //               ...data.data,
  //             },
  //           },
  //         });
  //       }
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         description: data?.message,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating user personal info:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleEdit = async () => {

  //   setIsLoading(true);
  //   try {
  //     if (!details?.firstName) {
  //       toast({
  //         variant: "destructive",
  //         description: "First name cannot be left empty",
  //       });
  //       setIsLoading(false);
  //       return;
  //     }

  //     const response = await fetchCustom("/user/personal", {
  //       method: "PUT",
  //       body: JSON.stringify({
  //         ...details,
  //         personalInfoId: details?._id,
  //       }),
  //       token: user?.token,
  //     });

  //     const data = await response.json();

  //     if (data?.success) {
  //       // ✅ Update local details state with new response data
  //       setDetails((prev) => ({
  //         ...prev,
  //         personalInfo: { ...data.data },
  //       }));

  //       // ✅ If using global state/context, update user personalInfo
  //       if (user) {
  //         user.personalInfo = { ...data.data };
  //       }

  //       await update({
  //         user: {
  //           ...session?.user,
  //           personalInfo: { ...data.data },
  //         },
  //       });

  //       await fetchUserData();

  //       toast({
  //         variant: "custom",
  //         description: data?.message,
  //       });
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         description: data?.message,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating user personal info:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-full relative">
        <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
          {isEditing && "Edit"} Personal Information
        </h3>
        {forProfile && (
          <Button
            variant={isEditing ? "destructive" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className=" absolute top-3 right-3 w-20"
          >
            {isEditing ? "" : "Edit"}
            {isEditing ? "Cancel" : <PenBoxIcon />}
          </Button>
        )}
      </div>
      <div
        className={`${
          isEditing
            ? "pointer-events-auto opacity-100"
            : "opacity-75 pointer-events-none "
        }`}
      >
        <div className=" w-full flex items-center justify-between py-4">
          {!isLoading ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${details?.avatar}`}
              width={200}
              height={200}
              className=" aspect-square rounded-full mx-auto border border-black"
              alt="avatar"
              onLoad={() => {
                if (!isLoading) {
                  setIsLoading(true);
                }
              }}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          ) : (
            <div>Loading...</div>
          )}
          <UploadFileToAWS
            prevFileName={details?.avatar}
            setFileName={(fileName) => {
              console.log(fileName);

              setDetails((prev) => {
                return {
                  ...prev,
                  avatar: fileName,
                };
              });
            }}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <InputComp
              id="title"
              name="title"
              value={details?.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <InputComp
              id="firstName"
              name="firstName"
              value={details?.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <InputComp
              id="middleName"
              name="middleName"
              value={details?.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <InputComp
              id="lastName"
              name="lastName"
              value={details?.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              className={" w-full bg-gray-200 disabled:opacity-65"}
              value={details?.phone}
              onChange={(phone) => {
                setDetails((prev) => {
                  return {
                    ...prev,
                    phone: phone,
                  };
                });
              }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            className="bg-gray-200"
            value={details?.address}
            onChange={handleChange}
          />
        </div>
      </div>
      {isEditing && (
        <Button
          className="w-full mt-6"
          onClick={handleEdit}
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </Button>
      )}
    </div>
  );
}

// "use client";

// import { useSession } from "next-auth/react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "@/hooks/use-toast";

// import useUser from "@/contexts/user";
// import { Label } from "@/components/ui/label";
// import { fetchCustom, formatDateForInput } from "@/lib/utils";
// import InputComp from "@/components/Utils/Input";
// import { Textarea } from "@/components/ui/textarea";
// import { PenBoxIcon } from "lucide-react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import Image from "next/image";
// import UploadFileToAWS from "@/components/Utils/UploadFileToAWS";

// export default function EditPersonalInfo({ personalInfo, forProfile = false }) {
//   const user = useUser();
//   const [isEditing, setIsEditing] = useState(!forProfile);
//   const [isLoading, setIsLoading] = useState(false);
//   const [details, setDetails] = useState(personalInfo);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const { data: session, update } = useSession();

//   const handleEdit = async () => {
//     setIsLoading(true);
//     try {
//       if (!details?.firstName) {
//         toast({
//           variant: "destructive",
//           description: "First name cannot be left empty",
//         });
//         return;
//       }

//       const response = await fetchCustom("/user/personal", {
//         method: "PUT",
//         body: JSON.stringify({
//           ...details,
//           personalInfoId: details?._id,
//         }),
//         token: user?.token,
//       });

//       const data = await response.json();
//       if (data?.success) {
//         toast({
//           variant: "custom",
//           description: data?.message,
//         });

//         console.log(data)

//         setDetails((prev) => ({
//           ...prev,
//           ...data.data,
//         }));

//         // Force session update to reflect changes instantly
//         await update({
//           user: {
//             ...session?.user,
//             personalInfo: {
//               ...session?.user?.personalInfo,
//               ...data.data,
//             },
//           },
//         });
//       } else {
//         toast({
//           variant: "destructive",
//           description: data?.message,
//         });
//       }
//     } catch (error) {
//       console.error("Error updating user personal info:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between w-full relative">
//         <h3 className="text-base md:text-xl font-semibold text-custom-gradient">
//           {isEditing && "Edit"} Personal Information
//         </h3>
//         {forProfile && (
//           <Button
//             variant={isEditing ? "destructive" : "default"}
//             onClick={() => setIsEditing(!isEditing)}
//             className=" absolute top-3 right-3 w-20"
//           >
//             {isEditing ? "" : "Edit"}
//             {isEditing ? "Cancel" : <PenBoxIcon />}
//           </Button>
//         )}
//       </div>
//       <div
//         className={`${isEditing ? "pointer-events-auto opacity-100" : "opacity-75 pointer-events-none "}`}
//       >
//         <div className=" w-full flex items-center justify-between py-4">
//           {!isLoading ? (
//             <Image
//               src={`${process.env.NEXT_PUBLIC_AWS_OBJECT_BASE_URL}${details?.avatar}`}
//               width={200}
//               height={200}
//               className=" aspect-square rounded-full mx-auto border border-black"
//               alt="avatar"
//               onLoad={() => {
//                 if (!isLoading) {
//                   setIsLoading(true);
//                 }
//               }}
//               onLoadingComplete={() => setIsLoading(false)}
//               onError={() => setIsLoading(false)}
//             />
//           ) : (
//             <div>Loading...</div>
//           )}
//           <UploadFileToAWS
//             prevFileName={details?.avatar}
//             setFileName={(fileName) => {
//               setDetails((prev) => ({
//                 ...prev,
//                 avatar: fileName,
//               }));
//             }}
//           />
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <div>
//             <Label htmlFor="title">Title</Label>
//             <InputComp
//               id="title"
//               name="title"
//               value={details?.title}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="firstName">First Name</Label>
//             <InputComp
//               id="firstName"
//               name="firstName"
//               value={details?.firstName}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="middleName">Middle Name</Label>
//             <InputComp
//               id="middleName"
//               name="middleName"
//               value={details?.middleName}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="lastName">Last Name</Label>
//             <InputComp
//               id="lastName"
//               name="lastName"
//               value={details?.lastName}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <Label htmlFor="phone">Phone</Label>
//             <PhoneInput
//               className={" w-full bg-gray-200 disabled:opacity-65"}
//               value={details?.phone}
//               onChange={(phone) => {
//                 setDetails((prev) => ({
//                   ...prev,
//                   phone: phone,
//                 }));
//               }}
//             />
//           </div>
//         </div>
//         <div>
//           <Label htmlFor="address">Address</Label>
//           <Textarea
//             id="address"
//             name="address"
//             className="bg-gray-200"
//             value={details?.address}
//             onChange={handleChange}
//           />
//         </div>
//       </div>
//       {isEditing && (
//         <Button
//           className="w-full mt-6"
//           onClick={handleEdit}
//           disabled={isLoading}
//         >
//           {isLoading ? "Updating..." : "Update"}
//         </Button>
//       )}
//     </div>
//   );
// }
