// import IconSecure from "@/assets/IconSecure";
// import IconFast from "@/assets/IconFast";
// import IconUser from "@/assets/IconUser";
// import IconNotification from "@/assets/IconNotification";
// import IconCloud from "@/assets/IconCloud";
// import IconSupport from "@/assets/IconSupport";
// import HeaderText from "../ui/HeaderText";
// import MessageCard from "./MessageCard";
// import EllipseSVG from "../svg/EllipseSVG";

// const MessageSection = () => {
//   const steps = [
//     {
//       step: "01",
//       title: "Secure & Private",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconSecure />,
//     },
//     {
//       step: "02",
//       title: "Fast & Responsive",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconFast />,
//     },
//     {
//       step: "03",
//       title: "User-Friendly Interface",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconUser />,
//     },
//     {
//       step: "04",
//       title: "Real-Time Notifications",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconNotification />,
//     },
//     {
//       step: "05",
//       title: "Cloud Sync",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconCloud />,
//     },
//     {
//       step: "06",
//       title: "24/7 Support",
//       description: "Suspendisse vitae risus Cras nulla blandit Praesent",
//       icon: <IconSupport />,
//     },
//   ];

//   return (
//     <section className="relative flex flex-col items-center  justify-between  w-full overflow-visible pt-20  bg-[url('/assets/logo/hand.png')] bg-cover bg-center">
//       <div className="absolute inset-0 bg-background/70 " />

//       <div className="mx-auto pb-20 z-10 relative  max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center">
//         {steps.map((s) => (
//           <MessageCard
//             key={s.step}
//             title={s.title}
//             description={s.description}
//             icon={s.icon}
//           />
//         ))}
//       </div>
//       <div className="relative z-10 text-soft w-full">
//         <EllipseSVG />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
//           <HeaderText
//             commonText={"Vestibulum"}
//             boldText={"HEAR FROM OUR HAPPY CLIENTS"}
//             commonClass="text-3xl md:text-5xl text-center"
//             boldClass="text-[22px] md:text-4xl lg:text-[45px] text-center"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MessageSection;
import IconSecure from "@/assets/IconSecure";
import IconFast from "@/assets/IconFast";
import IconUser from "@/assets/IconUser";
import IconNotification from "@/assets/IconNotification";
import IconCloud from "@/assets/IconCloud";
import IconSupport from "@/assets/IconSupport";
import HeaderText from "../ui/HeaderText";
import MessageCard from "./MessageCard";
import EllipseSVG from "../svg/EllipseSVG";

const MessageSection = () => {
  const steps = [
    {
      step: "01",
      title: "Secure & Private",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconSecure />,
    },
    {
      step: "02",
      title: "Fast & Responsive",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconFast />,
    },
    {
      step: "03",
      title: "User-Friendly Interface",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconUser />,
    },
    {
      step: "04",
      title: "Real-Time Notifications",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconNotification />,
    },
    {
      step: "05",
      title: "Cloud Sync",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconCloud />,
    },
    {
      step: "06",
      title: "24/7 Support",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconSupport />,
    },
  ];

  return (
    <section className="relative flex flex-col text-soft items-center justify-between  w-full overflow-visible pt-20  bg-[url('/assets/logo/hand.png')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/80" />
      <div className="mx-auto z-10 relative  max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 place-items-center">
        {steps.map((s) => (
          <MessageCard
            key={s.step}
            title={s.title}
            description={s.description}
            icon={s.icon}
          />
        ))}
      </div>
      <div className="w-full relative">
        <EllipseSVG />
      </div>
    </section>
  );
};

export default MessageSection;
