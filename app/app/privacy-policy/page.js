function Page() {
  return (
    <>
      <section className="pb-[120px] pt-[150px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
                  GradeMate Mobile App Privacy Policy
                </h2>
                <div>
                  The GradeMate app is created by Tanush Chauhan. I offer this
                  application at no cost and provide it for use as-is. This
                  Privacy Policy aims to explain how personal data is handled,
                  collected, and used in connection with the GradeMate app. By
                  using GradeMate, you agree to the practices outlined in this
                  policy.
                </div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Data Usage and Collection
                </h3>
                <div>
                  You may need to enter login credentials for your school’s
                  grade book system to use certain app functions: this
                  information and any data presented within the app stay stored
                  exclusively on your device. I do not collect, store, or access
                  this data. Your credentials are only used to pull your grade
                  and class details from the grade book system. As a result, I
                  cannot view or access any of the information you retrieve
                  through GradeMate.
                </div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Log Files
                </h3>
                <div>
                  {`If the app encounters an error or crashes, your device may
                  automatically send error reports to the app store. These
                  reports may contain non-sensitive information, such as the
                  type of device you're using, the version of your operating
                  system, the time the issue occurred, and other technical data.`}
                </div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Security Measures
                </h3>
                <div>
                  The security of your personal information depends on the
                  security of your school’s grade book system servers. GradeMate
                  functions by retrieving data from those servers, and the
                  security of your data is, therefore, tied to the gradebook
                  system’s existing security infrastructure.
                </div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Third-Party Links
                </h3>
                <div>
                  {`The GradeMate app may contain links to external websites. If
                  you follow a link to a third-party site, you will be taken
                  outside of GradeMate. Please note that I maintain only links
                  to websites under the domain grademate.me and
                  grademate.tanushchauhan.com. I am not responsible for any
                  third-party websites' privacy practices or content.`}
                </div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Privacy Policy Changes
                </h3>
                <div>
                  This policy may be revised periodically. Any updates will be
                  posted on this page.
                </div>
                <div>This policy is in effect as of September 15th, 2024.</div>
                <h3 className="mb-8 mt-8 text-xl font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight">
                  Contact Information
                </h3>
                <div>
                  If you have any concerns or suggestions regarding this Privacy
                  Policy, please
                  <a
                    href="mailto:contact@grademate.me"
                    className=" text-blue-600"
                  >
                    {" "}
                    contact@grademate.me
                  </a>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page;
