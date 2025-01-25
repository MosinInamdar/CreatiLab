import { Settings } from "lucide-react";

import { Heading } from "@/components/heading";
import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div>
      <Heading
        title="Settings"
        description="Manage account settings."
        icon={Settings}
        iconColor="text-gray-700"
        bgColor="bg-gray-700/10"
      />
      <div className="px-4 lg:px-8 space-y-4">
        <div className="text-muted-foreground text-sm">
          {isPro
            ? "You are currently on a Pro plan."
            : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>

      {/* Policy Links Section */}
      <div className="px-4 lg:px-8 space-y-2 mt-6">
        <h3 className="text-lg font-medium text-gray-800">Policies</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <a
              href="/terms-and-conditions"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Terms and Conditions
            </a>
          </li>
          <li>
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/refund-policy"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Refund Policy
            </a>
          </li>
        </ul>
      </div>

      {/* Contact Me Section */}
      <div className="px-4 lg:px-8 mt-6">
        <h3 className="text-lg font-medium text-gray-800">Contact Me</h3>
        <p className="text-sm text-muted-foreground">
          Have questions or concerns? Feel free to reach out via email.
        </p>
        <a
          href="mailto:mosininamdar18@gmail.com"
          className="text-blue-600 hover:underline text-sm"
        >
          CreatiLab™ Mail
        </a>
      </div>
    </div>
  );
};

export default SettingsPage;
