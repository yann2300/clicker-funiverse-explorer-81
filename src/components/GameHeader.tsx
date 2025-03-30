
import React from 'react';
import { formatNumber } from '@/lib/gameUtils';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { RefreshCw, Trophy, Volume2, VolumeX, Users } from 'lucide-react';

interface GameHeaderProps {
  points: number;
  pointsPerClick: number;
  pointsPerSecond: number;
  day: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  openAchievements: () => void;
  resetGame: () => void;
  placeholderUsers: Array<{
    id: number;
    name: string;
    avatarUrl: string;
  }>;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  points,
  pointsPerClick,
  pointsPerSecond,
  day,
  soundEnabled,
  toggleSound,
  openAchievements,
  resetGame,
  placeholderUsers,
}) => {
  return (
    <div 
      style={{ backgroundImage: 'linear-gradient(#515763 0%, #2f3540 100%)' }} 
      className="rounded-md shadow-md flex items-center justify-between px-4 py-3 mb-4 text-[#acb1b9]"
    >
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-[#acb1b9] tracking-tight">
          {formatNumber(points)}P
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">+{formatNumber(pointsPerClick)}/click</div>
          <div className="text-sm">+{formatNumber(pointsPerSecond)}/sec</div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="bg-[#434a5a] rounded-md px-3 py-1">
          <span className="text-sm font-medium">Day {day}</span>
        </div>
        
        {/* Reset, Achievements, SteamGifts Users, and Sound toggle buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]"
            onClick={toggleSound}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]"
                title="SteamGifts Users"
              >
                <Users size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>SteamGifts Users</DialogTitle>
                <DialogDescription>
                  Click on a user to visit their SteamGifts profile.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-4 max-h-[60vh] overflow-y-auto">
                {placeholderUsers.map(user => (
                  <a 
                    key={user.id}
                    href={`https://www.steamgifts.com/user/${user.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <Avatar className="w-16 h-16 mb-2">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-center">{user.name}</span>
                  </a>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            size="sm"
            className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]"
            onClick={openAchievements}
          >
            <Trophy size={16} />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full p-2 h-auto bg-[#434a5a] border-none text-[#acb1b9]">
                <RefreshCw size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset game progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your progress including points, upgrades, and statistics. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetGame} className="bg-red-500 hover:bg-red-600">Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default GameHeader;
