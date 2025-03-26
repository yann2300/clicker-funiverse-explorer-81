
import GameContainer from "@/components/GameContainer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SteamGifts-like Header */}
      <header className="bg-steamgifts-header border-b border-steamgifts-header-dark py-3">
        <div className="container max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            SteamGifts Clicker
          </h1>
          <div className="flex space-x-4">
            <a href="#" className="text-steamgifts-navigation hover:text-white transition-colors">Giveaways</a>
            <a href="#" className="text-steamgifts-navigation hover:text-white transition-colors">Deals</a>
            <a href="#" className="text-steamgifts-navigation hover:text-white transition-colors">Discussions</a>
            <a href="#" className="text-steamgifts-navigation hover:text-white transition-colors">Help</a>
          </div>
          <button className="bg-steamgifts-primary hover:bg-steamgifts-primary-hover text-white px-3 py-1 rounded text-sm">
            Sign in through STEAM
          </button>
        </div>
      </header>
      
      <main className="flex-grow bg-steamgifts-body py-6">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="bg-steamgifts-header-dark rounded-md p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/3">
              <img 
                src="/lovable-uploads/67522e5e-ff0a-49f4-aa73-160ac0906c86.png" 
                alt="Steam Gifts Promotion" 
                className="rounded-md max-w-full"
              />
            </div>
            <div className="md:w-2/3 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Win free Steam gifts
              </h2>
              <p className="text-xl opacity-90 mb-4">
                Or create a giveaway to share with your friends or online gaming community!
              </p>
              <button className="bg-steamgifts-primary hover:bg-steamgifts-primary-hover text-white px-4 py-2 rounded inline-flex items-center gap-2">
                Sign in through Steam
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          <GameContainer />
        </div>
      </main>
      
      <footer className="bg-steamgifts-header text-steamgifts-navigation py-4 text-center text-sm">
        <p>SteamGifts Clicker &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
