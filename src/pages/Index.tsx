
import GameContainer from "@/components/GameContainer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SteamGifts-like Header with gradient background */}
      <header className="py-3" style={{ backgroundImage: 'linear-gradient(#515763 0%, #2f3540 100%)' }}>
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-[#acb1b9] tracking-tight">
            SG Clicker
          </h1>
        </div>
      </header>
      
      <main className="flex-grow bg-steamgifts-body py-6">
        <div className="container max-w-6xl mx-auto px-4">
          <GameContainer />
        </div>
      </main>
      
      <footer style={{ backgroundImage: 'linear-gradient(#515763 0%, #2f3540 100%)' }} className="text-[#acb1b9] py-4 text-center text-sm">
        <p>SG Clicker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
