import { useRouter } from "next/navigation";

const templates = [
  {
    name: "Template 1",
    description: "Description of Template 1",
    thumbnail: "/images/Screenshot 2025-01-06 at 16.52.34.png", // Ensure this path is correct
  },
  {
    name: "Template 2",
    description: "Description of Template 2",
    thumbnail: "/images/Screenshot 2025-01-06 at 16.52.34.png", // Ensure this path is correct
  },
];

const TemplateList = () => {
  const router = useRouter();
  return (
    <section className="custom-scrollbar h-screen w-3/4 overflow-y-auto bg-white p-5">
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
            <img
              src={template.thumbnail}
              alt={template.name}
              className="mb-4 h-40 w-full rounded-md object-cover"
            />
            <h3 className="mb-2 text-lg font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemplateList;
