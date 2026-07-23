// src/components/profile/PersonalInfo.jsx

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

function PersonalInfo() {
  return (
    <div
      className="rounded-2xl p-5 sm:p-8 border"
      style={{
        background: "#162117",
        borderColor: "var(--primary-dark)",
      }}
    >

      <h2 className="text-xl lg:text-2xl font-bold text-white mb-8">
        Personal Information
      </h2>


      <div className="space-y-6">


        <div className="flex items-center gap-4">

          <FaUser
            className="text-lg"
            style={{ color: "var(--primary-light)" }}
          />

          <div>
            <p className="text-xs lg:text-sm text-gray-400">
              Full Name
            </p>

            <h3 className="text-sm lg:text-base text-white font-semibold">
              Frederick
            </h3>
          </div>

        </div>



        <div className="flex items-center gap-4">

          <FaEnvelope
            className="text-lg"
            style={{ color: "var(--primary-light)" }}
          />

          <div>
            <p className="text-xs lg:text-sm text-gray-400">
              Email
            </p>

            <h3 className="text-sm lg:text-base text-white break-all">
              fred@example.com
            </h3>
          </div>

        </div>




        <div className="flex items-center gap-4">

          <FaPhone
            className="text-lg"
            style={{ color: "var(--primary-light)" }}
          />

          <div>
            <p className="text-xs lg:text-sm text-gray-400">
              Phone
            </p>

            <h3 className="text-sm lg:text-base text-white">
              +256 700 000000
            </h3>
          </div>

        </div>




        <div className="flex items-center gap-4">

          <FaMapMarkerAlt
            className="text-lg"
            style={{ color: "var(--primary-light)" }}
          />

          <div>
            <p className="text-xs lg:text-sm text-gray-400">
              Location
            </p>

            <h3 className="text-sm lg:text-base text-white">
              Kampala, Uganda
            </h3>
          </div>

        </div>




        <div className="flex items-center gap-4">

          <FaCalendarAlt
            className="text-lg"
            style={{ color: "var(--primary-light)" }}
          />

          <div>
            <p className="text-xs lg:text-sm text-gray-400">
              Member Since
            </p>

            <h3 className="text-sm lg:text-base text-white">
              July 2026
            </h3>
          </div>

        </div>


      </div>

    </div>
  );
}

export default PersonalInfo;