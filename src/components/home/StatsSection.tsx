import { Users, Heart, Baby, Gift } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "530+",
    label: "Our Volunteer",
  },
  {
    icon: Heart,
    value: "22+",
    label: "Happy Children",
  },
  {
    icon: Baby,
    value: "22+",
    label: "Our Volunteer",
  },
  {
    icon: Gift,
    value: "22+",
    label: "Our Volunteer",
  },
];

export function StatsSection() {
  return (
    <section className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 rounded-full bg-primary p-2 text-white shadow-lg`}
            >
              <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-white">
                <stat.icon className="h-10 w-10 text-text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold md:text-3xl">{stat.value}</div>
                <div className="text-xs text-white/80 md:text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
