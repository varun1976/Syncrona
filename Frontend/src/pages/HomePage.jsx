import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen w-full flex flex-col pt-14 sm:pt-16 pb-2 px-2 sm:px-3 neu-bg overflow-hidden box-border">
      <div className="w-full flex-1 neu-raised-lg rounded-3xl overflow-hidden p-1.5 sm:p-2 min-h-0 box-border">
        <div className="flex h-full rounded-2xl overflow-hidden neu-inset-sm min-w-0 min-h-0">
          <Sidebar />
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;