import { useRouter } from "next/navigation";
import Edit from "../utils/edit";

const templates = [
  {
    name: "Template 1",
    description: "Description of Template 1",
    component: (
      <Edit
        primaryColor="text-blue-500"
        secondaryColor="text-red-500"
        bgColor="bg-gray-900"
        isEdit={false}
      />
    ),
    bgColor: "bg-gray-900",
  },
];

const TemplateList = () => {
  const router = useRouter();
  return (
    <section className="custom-scrollbar h-screen w-3/4 overflow-y-auto p-5">
      <h2 className="mb-4 text-xl font-bold text-black">Templates</h2>{" "}
      {/* Added ml-4 to align with sidebar */}
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <div
            key={template.name}
            className="w-full rounded-lg border p-4 shadow-sm transition-shadow duration-300 hover:cursor-pointer hover:shadow-lg"
            onClick={() => {
              router.push("/preview");
            }}
          >
            {template.component ? (
              <div className={`mb-4 w-full h-48 rounded-md overflow-auto transition-transform duration-300 hover:scale-105 ${template.bgColor}`}>
                {template.component}
              </div>
            ) : (
              <img
                src={template.thumbnail}
                alt={template.name}
                className="mb-4 h-40 w-full rounded-md object-cover"
              />
            )}
            <h3 className="mb-2 text-lg font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplateList;
