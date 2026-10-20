import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@erbium/ui/components/item";

const music = [
  {
    album: "Electric Nights",
    artist: "Neon Dreams",
    duration: "3:45",
    title: "Midnight City Lights",
  },
  {
    album: "Urban Stories",
    artist: "The Morning Brew",
    duration: "4:05",
    title: "Coffee Shop Conversations",
  },
  {
    album: "Binary Beats",
    artist: "Cyber Symphony",
    duration: "3:30",
    title: "Digital Rain",
  },
];

export const ItemImage = () => (
  <div className="flex w-full max-w-md flex-col gap-section">
    <ItemGroup className="gap-group">
      {music.map((song) => (
        <Item key={song.title} variant="card" render={<a href="#" />} role="listitem">
          <ItemMedia variant="image">
            <img
              src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2264%22%20height%3D%2264%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2232%22%20fill%3D%22%23475569%22%2F%3E%3Ctext%20x%3D%2232%22%20y%3D%2233%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2222%22%20fill%3D%22white%22%3E%E2%99%AB%3C%2Ftext%3E%3C%2Fsvg%3E"
              alt={song.title}
              width={32}
              height={32}
              className="object-cover grayscale"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">
              {song.title} - <span className="text-muted-foreground">{song.album}</span>
            </ItemTitle>
            <ItemDescription>{song.artist}</ItemDescription>
          </ItemContent>
          <ItemContent className="flex-none text-center">
            <ItemDescription>{song.duration}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  </div>
);
