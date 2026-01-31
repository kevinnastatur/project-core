import toast from "react-hot-toast";

const ToastWrapper = ({
  children,
  visible,
}: {
  children: React.ReactNode;
  visible: boolean;
}) => {
  return (
    <div
      className={`transition-all duration-300 transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      {children}
    </div>
  );
};

export const showSuccessToast = (title: string, description?: string) => {
  const id = toast.custom((t) => (
    <ToastWrapper visible={t.visible}>
      <div className="flex gap-3 items-center bg-white text-secondary p-4 rounded-md shadow-md border border-green-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <path
            d="M18.7022 11.7022C19.0439 11.3605 19.0439 10.8065 18.7022 10.4648C18.3605 10.1231 17.8065 10.1231 17.4648 10.4648L12.2502 15.6794L10.5355 13.9648C10.1938 13.6231 9.63982 13.6231 9.29811 13.9648C8.9564 14.3065 8.9564 14.8605 9.29811 15.2022L11.6314 17.5355C11.9732 17.8773 12.5272 17.8773 12.8689 17.5355L18.7022 11.7022Z"
            fill="#00DF80"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.0002 1.4585C7.07359 1.4585 1.4585 7.07359 1.4585 14.0002C1.4585 20.9267 7.07359 26.5418 14.0002 26.5418C20.9267 26.5418 26.5418 20.9267 26.5418 14.0002C26.5418 7.07359 20.9267 1.4585 14.0002 1.4585ZM3.2085 14.0002C3.2085 8.04009 8.04009 3.2085 14.0002 3.2085C19.9602 3.2085 24.7918 8.04009 24.7918 14.0002C24.7918 19.9602 19.9602 24.7918 14.0002 24.7918C8.04009 24.7918 3.2085 19.9602 3.2085 14.0002Z"
            fill="#00DF80"
          />
        </svg>
        <div className="flex flex-col">
          <strong className="font-semibold">{title}</strong>
          {description && (
            <span className="text-sm font-extralight">{description}</span>
          )}
        </div>
      </div>
    </ToastWrapper>
  ));
};

export const showErrorToast = (title: string, description?: string) => {
  toast.custom((t) => (
    <ToastWrapper visible={t.visible}>
      <div className="flex gap-3 items-center bg-white text-secondary p-4 rounded-md shadow-md border border-red-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
        >
          <path
            d="M14.0002 7.29183C14.4834 7.29183 14.8752 7.68358 14.8752 8.16683V15.1668C14.8752 15.6501 14.4834 16.0418 14.0002 16.0418C13.5169 16.0418 13.1252 15.6501 13.1252 15.1668V8.16683C13.1252 7.68358 13.5169 7.29183 14.0002 7.29183Z"
            fill="#DF3400"
          />
          <path
            d="M14.0002 19.8335C14.6445 19.8335 15.1668 19.3112 15.1668 18.6668C15.1668 18.0225 14.6445 17.5002 14.0002 17.5002C13.3558 17.5002 12.8335 18.0225 12.8335 18.6668C12.8335 19.3112 13.3558 19.8335 14.0002 19.8335Z"
            fill="#DF3400"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.4585 14.0002C1.4585 7.07359 7.07359 1.4585 14.0002 1.4585C20.9267 1.4585 26.5418 7.07359 26.5418 14.0002C26.5418 20.9267 20.9267 26.5418 14.0002 26.5418C7.07359 26.5418 1.4585 20.9267 1.4585 14.0002ZM14.0002 3.2085C8.04009 3.2085 3.2085 8.04009 3.2085 14.0002C3.2085 19.9602 8.04009 24.7918 14.0002 24.7918C19.9602 24.7918 24.7918 19.9602 14.0002 3.2085Z"
            fill="#DF3400"
          />
        </svg>
        <div className="flex flex-col">
          <strong className="font-semibold">{title}</strong>
          {description && (
            <span className="text-sm font-extralight">{description}</span>
          )}
        </div>
      </div>
    </ToastWrapper>
  ));
};
