
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface EventRecapProps {
  day: number;
  username: string;
}

// Define the list of users for each day
const dayUsers = [
  { day: 1, username: "Ch1ckwolf" },
  { day: 2, username: "Conti" },
  { day: 3, username: "Scorkla" },
  { day: 4, username: "ZeePilot" },
  { day: 5, username: "Codric" },
  { day: 6, username: "yannbz" },
  { day: 7, username: "puninup" },
  { day: 8, username: "CuteEnby" },
  { day: 9, username: "Schmoan" },
  { day: 10, username: "Ottah" },
  { day: 11, username: "RGVS" },
  { day: 12, username: "Shurraxxo" },
  { day: 13, username: "Yugimax" },
  { day: 14, username: "DinoRoar" },
  { day: 15, username: "Ellendyl" },
  { day: 16, username: "McZero" },
  { day: 17, username: "GeekDoesStuff" },
  { day: 18, username: "canis39" },
  { day: 19, username: "sobbiebox" },
  { day: 20, username: "ShroudOfLethe" },
  { day: 21, username: "quijote3000" },
  { day: 22, username: "Sakakino" },
  { day: 23, username: "NymCast" },
  { day: 24, username: "rockpin" },
  { day: 25, username: "Wagakki" },
  { day: 26, username: "imminiman" },
  { day: 27, username: "ConanOLion" },
  { day: 28, username: "eldonar" },
  { day: 29, username: "eeev" },
  { day: 30, username: "JLleego" },
  { day: 31, username: "Gus09" }
];

const EventRecap: React.FC<EventRecapProps> = ({ day }) => {
  // Get the user for the current day
  const currentUser = dayUsers.find(user => user.day === day) || dayUsers[0];
  
  // Generate avatar url using a service that creates avatars from strings
  const avatarUrl = `https://source.boringavatars.com/beam/120/${currentUser.username}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
  
  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="bg-[#2f3540] text-[#acb1b9] font-medium px-4 py-3 border-b border-[#44474e]">
        Recap of the MEGAEVENT - Day {day}
      </div>
      <div style={{ backgroundImage: 'linear-gradient(#515763 0%, #2f3540 100%)' }} className="p-4 text-[#acb1b9]">
        <div className="flex items-center gap-4">
          <a 
            href={`https://www.steamgifts.com/user/${currentUser.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarUrl} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{currentUser.username}</h3>
              <p className="text-sm opacity-80">Participated on Day {day}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventRecap;
