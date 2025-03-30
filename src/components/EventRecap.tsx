
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DayUser } from '@/types/gameState';

interface EventRecapProps {
  day: number;
  username: string;
}

// Define day users
const dayUsers: DayUser[] = [
  { day: 1, username: "Ch1ckwolf", profileUrl: "https://www.steamgifts.com/user/Ch1ckwolf" },
  { day: 2, username: "Conti", profileUrl: "https://www.steamgifts.com/user/Conti" },
  { day: 3, username: "Scorkla", profileUrl: "https://www.steamgifts.com/user/Scorkla" },
  { day: 4, username: "ZeePilot", profileUrl: "https://www.steamgifts.com/user/ZeePilot" },
  { day: 5, username: "Codric", profileUrl: "https://www.steamgifts.com/user/Codric" },
  { day: 6, username: "yannbz", profileUrl: "https://www.steamgifts.com/user/yannbz" },
  { day: 7, username: "puninup", profileUrl: "https://www.steamgifts.com/user/puninup" },
  { day: 8, username: "CuteEnby", profileUrl: "https://www.steamgifts.com/user/CuteEnby" },
  { day: 9, username: "Schmoan", profileUrl: "https://www.steamgifts.com/user/Schmoan" },
  { day: 10, username: "Ottah", profileUrl: "https://www.steamgifts.com/user/Ottah" },
  { day: 11, username: "RGVS", profileUrl: "https://www.steamgifts.com/user/RGVS" },
  { day: 12, username: "Shurraxxo", profileUrl: "https://www.steamgifts.com/user/Shurraxxo" },
  { day: 13, username: "Yugimax", profileUrl: "https://www.steamgifts.com/user/Yugimax" },
  { day: 14, username: "DinoRoar", profileUrl: "https://www.steamgifts.com/user/DinoRoar" },
  { day: 15, username: "Ellendyl", profileUrl: "https://www.steamgifts.com/user/Ellendyl" },
  { day: 16, username: "McZero", profileUrl: "https://www.steamgifts.com/user/McZero" },
  { day: 17, username: "GeekDoesStuff", profileUrl: "https://www.steamgifts.com/user/GeekDoesStuff" },
  { day: 18, username: "canis39", profileUrl: "https://www.steamgifts.com/user/canis39" },
  { day: 19, username: "sobbiebox", profileUrl: "https://www.steamgifts.com/user/sobbiebox" },
  { day: 20, username: "ShroudOfLethe", profileUrl: "https://www.steamgifts.com/user/ShroudOfLethe" },
  { day: 21, username: "quijote3000", profileUrl: "https://www.steamgifts.com/user/quijote3000" },
  { day: 22, username: "Sakakino", profileUrl: "https://www.steamgifts.com/user/Sakakino" },
  { day: 23, username: "NymCast", profileUrl: "https://www.steamgifts.com/user/NymCast" },
  { day: 24, username: "rockpin", profileUrl: "https://www.steamgifts.com/user/rockpin" },
  { day: 25, username: "Wagakki", profileUrl: "https://www.steamgifts.com/user/Wagakki" },
  { day: 26, username: "imminiman", profileUrl: "https://www.steamgifts.com/user/imminiman" },
  { day: 27, username: "ConanOLion", profileUrl: "https://www.steamgifts.com/user/ConanOLion" },
  { day: 28, username: "eldonar", profileUrl: "https://www.steamgifts.com/user/eldonar" },
  { day: 29, username: "eeev", profileUrl: "https://www.steamgifts.com/user/eeev" },
  { day: 30, username: "JLleego", profileUrl: "https://www.steamgifts.com/user/JLleego" },
  { day: 31, username: "Gus09", profileUrl: "https://www.steamgifts.com/user/Gus09" },
];

const EventRecap: React.FC<EventRecapProps> = ({ day }) => {
  // Find the user for the current day
  const currentDayUser = dayUsers.find(user => user.day === day) || dayUsers[0];
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">Recap of the MEGAEVENT</h2>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`https://source.boringavatars.com/beam/120/${currentDayUser.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`} alt={currentDayUser.username} />
          <AvatarFallback>{currentDayUser.username.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm">Day {day} Participant:</p>
          <a 
            href={currentDayUser.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {currentDayUser.username}
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventRecap;
