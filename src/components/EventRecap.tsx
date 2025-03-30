
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EventRecapProps {
  day: number;
  username?: string;
}

// Users for each day
const dayUsers: Record<number, { username: string, profileUrl: string }> = {
  1: { username: 'Ch1ckwolf', profileUrl: 'https://www.steamgifts.com/user/Ch1ckwolf' },
  2: { username: 'Conti', profileUrl: 'https://www.steamgifts.com/user/Conti' },
  3: { username: 'Scorkla', profileUrl: 'https://www.steamgifts.com/user/Scorkla' },
  4: { username: 'ZeePilot', profileUrl: 'https://www.steamgifts.com/user/ZeePilot' },
  5: { username: 'Codric', profileUrl: 'https://www.steamgifts.com/user/Codric' },
  6: { username: 'yannbz', profileUrl: 'https://www.steamgifts.com/user/yannbz' },
  7: { username: 'puninup', profileUrl: 'https://www.steamgifts.com/user/puninup' },
  8: { username: 'CuteEnby', profileUrl: 'https://www.steamgifts.com/user/CuteEnby' },
  9: { username: 'Schmoan', profileUrl: 'https://www.steamgifts.com/user/Schmoan' },
  10: { username: 'Ottah', profileUrl: 'https://www.steamgifts.com/user/Ottah' },
  11: { username: 'RGVS', profileUrl: 'https://www.steamgifts.com/user/RGVS' },
  12: { username: 'Shurraxxo', profileUrl: 'https://www.steamgifts.com/user/Shurraxxo' },
  13: { username: 'Yugimax', profileUrl: 'https://www.steamgifts.com/user/Yugimax' },
  14: { username: 'DinoRoar', profileUrl: 'https://www.steamgifts.com/user/DinoRoar' },
  15: { username: 'Ellendyl', profileUrl: 'https://www.steamgifts.com/user/Ellendyl' },
  16: { username: 'McZero', profileUrl: 'https://www.steamgifts.com/user/McZero' },
  17: { username: 'GeekDoesStuff', profileUrl: 'https://www.steamgifts.com/user/GeekDoesStuff' },
  18: { username: 'canis39', profileUrl: 'https://www.steamgifts.com/user/canis39' },
  19: { username: 'sobbiebox', profileUrl: 'https://www.steamgifts.com/user/sobbiebox' },
  20: { username: 'ShroudOfLethe', profileUrl: 'https://www.steamgifts.com/user/ShroudOfLethe' },
  21: { username: 'quijote3000', profileUrl: 'https://www.steamgifts.com/user/quijote3000' },
  22: { username: 'Sakakino', profileUrl: 'https://www.steamgifts.com/user/Sakakino' },
  23: { username: 'NymCast', profileUrl: 'https://www.steamgifts.com/user/NymCast' },
  24: { username: 'rockpin', profileUrl: 'https://www.steamgifts.com/user/rockpin' },
  25: { username: 'Wagakki', profileUrl: 'https://www.steamgifts.com/user/Wagakki' },
  26: { username: 'imminiman', profileUrl: 'https://www.steamgifts.com/user/imminiman' },
  27: { username: 'ConanOLion', profileUrl: 'https://www.steamgifts.com/user/ConanOLion' },
  28: { username: 'eldonar', profileUrl: 'https://www.steamgifts.com/user/eldonar' },
  29: { username: 'eeev', profileUrl: 'https://www.steamgifts.com/user/eeev' },
  30: { username: 'JLleego', profileUrl: 'https://www.steamgifts.com/user/JLleego' },
  31: { username: 'Gus09', profileUrl: 'https://www.steamgifts.com/user/Gus09' },
};

const EventRecap: React.FC<EventRecapProps> = ({ day, username }) => {
  // Get the user for this day
  const user = dayUsers[day] || { username: 'User', profileUrl: '#' };
  const avatarUrl = `https://source.boringavatars.com/beam/120/${user.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
  
  return (
    <div className="bg-[#2f3540] rounded-md shadow-md p-4 text-[#acb1b9]">
      <h2 className="text-xl font-semibold mb-4">Recap of the MEGAEVENT - Day {day}</h2>
      
      <div className="flex items-center gap-4">
        <div>
          <a 
            href={user.profileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-[#5c9832] transition-colors"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarUrl} alt={user.username} />
              <AvatarFallback>{user.username.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.username}</span>
          </a>
        </div>
        
        <div className="ml-auto">
          <span className="text-sm">Participating in SteamGifts MEGAEVENT</span>
        </div>
      </div>
    </div>
  );
};

export default EventRecap;
