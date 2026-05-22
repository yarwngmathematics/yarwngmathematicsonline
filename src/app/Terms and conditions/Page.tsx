import PolicyLayout from "../components/PolicyLayout";

export const metadata = {
  title: "Terms & Conditions | Yarwng Mathematics",
  description: "Terms and Conditions for Yarwng Mathematics online coaching platform.",
};

export default function TermsPage() {
  return (
    <PolicyLayout
      badge="Legal · Terms & Conditions"
      title="Terms & Conditions"
      subtitle="Yarwng Mathematics · yarwngmathematicsonline.vercel.app"
      effectiveDate="June 2025"
      intro="This document is an electronic record under the Information Technology Act, 2000. The Platform is owned by Yarwng Mathematics (Contact: 9366030347), registered at Bashi Kobra Para, Radhamohanpur, West Tripura – 799045. By accessing or using the Platform, you agree to be bound by these Terms of Use. Please read them carefully before proceeding."
      sections={[
        {
          title: "User Responsibilities",
          items: [
            "You agree to provide true, accurate and complete information during and after registration, and shall be responsible for all acts done through your registered account.",
            "Your use of our Services and the Platform is solely at your own risk. You are required to independently assess and ensure the Services meet your requirements.",
            "You agree to pay the charges associated with availing the Services as communicated on the Platform.",
            "You agree not to use the Platform or Services for any purpose that is unlawful, illegal or forbidden by these Terms or applicable Indian laws.",
            "Unauthorized use of the Platform or Services may lead to action against you as per these Terms and/or applicable laws.",
          ],
        },
        {
          title: "Intellectual Property",
          items: [
            "The contents of the Platform and the Services are proprietary to us and are licensed to us.",
            "You will not have any authority to claim any intellectual property rights, title, or interest in any contents of the Platform.",
            "Contents include but are not limited to the design, layout, look, graphics, and course material.",
          ],
        },
        {
          title: "Disclaimer of Warranties",
          items: [
            "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials offered on this website.",
            "Such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies to the fullest extent permitted by law.",
          ],
        },
        {
          title: "Third-Party Links",
          items: [
            "The Platform and Services may contain links to third-party websites. On accessing these links, you will be governed by the terms, privacy policy, and other policies of those third-party websites.",
            "These links are provided for your convenience only. We bear no responsibility for third-party content or policies.",
          ],
        },
        {
          title: "Transactions & Contracts",
          items: [
            "Upon initiating a transaction for availing the Services, you are entering into a legally binding and enforceable contract with the Platform Owner for those Services.",
            "You shall indemnify and hold harmless Platform Owner, its affiliates, officers, directors, agents, and employees from any claim or demand arising out of your breach of these Terms.",
            "The parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.",
          ],
        },
        {
          title: "Governing Law & Jurisdiction",
          items: [
            "These Terms and any dispute or claim relating to them shall be governed by and construed in accordance with the laws of India.",
            "All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of competent courts in India.",
            "All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website.",
            "These Terms of Use can be modified at any time without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates.",
          ],
        },
      ]}
      contactNote="For any queries related to these Terms & Conditions, please contact us via email or phone. We aim to respond within 2 business days (Monday–Friday, 9:00 AM – 6:00 PM)."
    />
  );
}