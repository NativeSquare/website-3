const Legal: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-geist text-gray-900 mb-12">
          Legal &amp; Privacy
        </h1>

        <div className="prose prose-lg prose-indigo max-w-none text-gray-600 font-geist">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 font-geist mb-6">Privacy Policy</h2>
            <p className="mb-4 text-sm text-gray-500 uppercase tracking-wide">
              Last Updated: October 2024
            </p>

            <p className="mb-4">
              NativeSquare (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your
              privacy and is committed to protecting your personal data. This privacy policy will
              inform you as to how we look after your personal data when you visit our website
              (regardless of where you visit it from) and tell you about your privacy rights and
              how the law protects you.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">
              1. Information We Collect
            </h3>
            <p className="mb-4">
              We may collect, use, store and transfer different kinds of personal data about you
              which we have grouped together follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <strong>Identity Data:</strong> includes first name, last name, username or similar
                identifier.
              </li>
              <li>
                <strong>Contact Data:</strong> includes email address and telephone number.
              </li>
              <li>
                <strong>Technical Data:</strong> includes IP address, browser details, timezone, and
                device information.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">
              2. How We Use Your Data
            </h3>
            <p className="mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will
              use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                Where we need to perform the contract we are about to enter into or have entered into
                with you.
              </li>
              <li>Where it is necessary for our legitimate interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">3. Data Security</h3>
            <p className="mb-4">
              We have put in place appropriate security measures to prevent your personal data from
              being accidentally lost, used or accessed in an unauthorized way, altered or
              disclosed. Access to your data is limited to team members who have a business need to
              know.
            </p>
          </section>

          <div className="w-full h-px bg-gray-200 my-12"></div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 font-geist mb-6">Terms of Service</h2>
            <p className="mb-4 text-sm text-gray-500 uppercase tracking-wide">
              Effective Date: October 2024
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">1. Engagement</h3>
            <p className="mb-4">
              By hiring NativeSquare for software development, design, or consulting services, you
              agree to the terms outlined in our individual Master Services Agreement (MSA) and
              Statement of Work (SOW). These web terms serve as a general baseline for our digital
              interactions.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">
              2. Intellectual Property
            </h3>
            <p className="mb-4">
              Unless otherwise stated in a specific client agreement, all code, designs, and assets
              created by NativeSquare for a client become the property of the client upon full
              payment. NativeSquare retains the right to use the work for portfolio and marketing
              purposes unless a Non-Disclosure Agreement (NDA) specifies otherwise.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">
              3. Limitation of Liability
            </h3>
            <p className="mb-4">
              NativeSquare shall not be liable for any indirect, incidental, special, consequential or
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or
              other intangible losses.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3 font-geist">4. Governing Law</h3>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of the United
              States, without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;
