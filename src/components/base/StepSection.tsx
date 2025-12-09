import IconStepFirst from "@/assets/IconStepFirst";
import IconStepSecond from "@/assets/IconStepSecond";
import IconStepThird from "@/assets/IconStepThird";
import StepCard from "./StepCard";
import HeaderText from "../ui/HeaderText";

const StepsSection = () => {
  const steps = [
    {
      step: "01",
      title: "Track Your Week",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconStepFirst />,
    },
    {
      step: "02",
      title: "Access Expert Content",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconStepSecond />,
    },
    {
      step: "03",
      title: "Use Smart Checklists",
      description: "Suspendisse vitae risus Cras nulla blandit Praesent",
      icon: <IconStepThird />,
    },
  ];

  return (
    <section className="bg-soft py-20">
      <div className="text-center">
        <HeaderText
          commonText={"Step-By-Step"}
          boldText={"HOW IT WORKS"}
          commonClass="text-[40px]"
          boldClass="text-[45px]"
        />
      </div>
      <div className="px-4 mt-24">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4 px-4">
          {steps.map((s) => (
            <StepCard
              key={s.step}
              step={s.step}
              title={s.title}
              description={s.description}
              icon={s.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
