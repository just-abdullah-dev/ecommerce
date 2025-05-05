import { Label } from "@/components/ui/label";
import InputComp from "@/components/Utils/Input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateForInput } from "@/lib/utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function ClientDetails({ details, setDetails }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-custom-gradient">
        Client Details
      </h3>
      <div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <InputComp
              id="title"
              name="title"
              placeholder="e.g., Mr., Mrs., Ms."
              value={details.personalInfo?.title}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <InputComp
              id="firstName"
              name="firstName"
              value={details.personalInfo?.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="middleName">Middle Name</Label>
            <InputComp
              id="middleName"
              name="middleName"
              value={details.personalInfo?.middleName}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <InputComp
              id="lastName"
              name="lastName"
              value={details.personalInfo?.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <InputComp
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={details.email}
              onChange={(e) => {
                setDetails((prev) => {
                  return {
                    ...prev,
                    email: e.target.value,
                  };
                });
              }}
            />
          </div>

          <div>
            <Label htmlFor="joinDate">On Board Date</Label>
            <InputComp
              id="joinDate"
              name="joinDate"
              type="date"
              value={formatDateForInput(details.personalInfo?.joinDate)}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <PhoneInput
              className={" w-full bg-gray-200"}
              value={details.personalInfo?.phone}
              onChange={(phone) => {
                setDetails({
                  ...details,
                  personalInfo: {
                    ...details.personalInfo,
                    phone: phone,
                  },
                });
              }}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            name="about"
            className="bg-gray-200"
            value={details.personalInfo?.about}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            className="bg-gray-200"
            value={details.personalInfo?.address}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
