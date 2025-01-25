import React from "react";
import LandingLayout from "@/app/(landing)/layout";
import privacyPolicy from "./PrivacyPolicy";

type Props = {};

const PrivacyPolicyPage = (props: Props) => {
  return (
    <LandingLayout>
      <div className="bg-gray-900 text-gray-100 py-12 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-bold mb-8 text-center">
            Privacy Policy
          </h1>
          <div className="space-y-6">
            <section>
              {privacyPolicy.map((term, index) => (
                <div key={index} className="m-2 p-2">
                  <h2 className="text-2xl font-semibold mb-4">
                    {index + 1}. {term.title}
                  </h2>
                  <p>{term.content}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default PrivacyPolicyPage;
