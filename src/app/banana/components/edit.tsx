import FooterEdit from "./footerEdit";
import HeaderEdit from "./headerEdit";
import MainEdit from "./mainEdit";

export default function Edit({ isFullscreen }: { isFullscreen: boolean }) {
    return (
      <div className={`flex flex-1 flex-col ${isFullscreen ? "" : "rounded-b-lg"} bg-red-400`}>
        <HeaderEdit isFullscreen={isFullscreen} />
        <MainEdit />
        <div className="flex-1">
          <FooterEdit />
        </div>
      </div>
    );
  }