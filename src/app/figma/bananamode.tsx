import { useState, useEffect } from "react";
import { SiGamebanana } from "react-icons/si";
import { AiOutlineClose } from "react-icons/ai";
import { db, useUser } from "../components/UserContext";
import { collection, getDocs, deleteDoc, doc, setDoc, query, orderBy } from "firebase/firestore";


interface Title {
  html: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
}

interface BananamodeProps {
  loadDesign: (design: Title[]) => void;
  saveDesign: Title[];
}

const Bananamode: React.FC<BananamodeProps> = ({ loadDesign, saveDesign }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedDesigns, setSavedDesigns] = useState<{ name: string; design: Title[]; timestamp: number }[]>([]);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchDesigns = async () => {
      if (currentUser) {
        const q = query(collection(db, `designs/${currentUser.uid}/userDesigns`), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const designs = querySnapshot.docs.map(doc => ({ name: doc.id, design: doc.data().design, timestamp: doc.data().timestamp }));
        setSavedDesigns(designs);
      }
    };
    fetchDesigns();
  }, [currentUser]);

  useEffect(() => {
    const savedData = JSON.stringify(saveDesign);
    localStorage.setItem("savedTitles", savedData);
    console.log("Work saved!", savedData);
  }, [saveDesign]);

  useEffect(() => {
    const savedData = localStorage.getItem("savedTitles");
    if (savedData) {
      loadDesign(JSON.parse(savedData));
      console.log("Work loaded!", savedData);
    }
  }, []);

  const toggleWindow = () => {
    setIsOpen(!isOpen);
  };

  const handleLoadDesign = (design: Title[]) => {
    loadDesign(design);
    toggleWindow();
  };

  const handleSaveDesign = async () => {
    if (currentUser) {
      const designName = prompt("Enter design name:", `Unnamed Design ${savedDesigns.length + 1}`);
      if (designName) {
        const designRef = doc(db, `designs/${currentUser.uid}/userDesigns`, designName);
        await setDoc(designRef, { design: saveDesign, timestamp: Date.now() });
        console.log("Design saved!", `designs/${currentUser.uid}/userDesigns/${designName}`);
        setSavedDesigns([{ name: designName, design: saveDesign, timestamp: Date.now() }, ...savedDesigns]);
      }
    }
  };

  const handleDeleteDesign = async (index: number) => {
    if (currentUser) {
      const designToDelete = savedDesigns[index];
      await deleteDoc(doc(db, `designs/${currentUser.uid}/userDesigns`, designToDelete.name));
      setSavedDesigns(savedDesigns.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <SiGamebanana
        className="fixed top-4 right-4 cursor-pointer text-3xl text-yellow-500"
        onClick={toggleWindow}
      />
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-64 bg-gray-900 p-6 shadow-lg transition-transform transform translate-x-0">
          <button onClick={toggleWindow} className="absolute top-2 right-2 text-white">
            <AiOutlineClose className="text-2xl" />
          </button>
          <h2 className="mb-4 text-lg font-bold text-white">Saved Designs</h2>
          <button onClick={handleSaveDesign} className="mb-4 w-full rounded bg-blue-500 p-2 text-white">
            Save Current Design
          </button>
          <ul className="space-y-2">
            {savedDesigns.map((item, index) => (
              <li key={index} className="flex items-center justify-between rounded bg-gray-800 p-2 text-white hover:bg-gray-700">
                <span className="flex-1 cursor-pointer" onClick={() => handleLoadDesign(item.design)}>
                  {item.name}
                </span>
                <button onClick={() => handleDeleteDesign(index)} className="ml-2 text-red-500">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Bananamode;
