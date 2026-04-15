import Image from "next/image";
import { API_BASE_URL } from "@/lib/config";

type PlantImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function PlantImage({
  src,
  alt,
  className,
  priority,
  sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
}: PlantImageProps) {
  const seedImageFallbacks: Record<string, string> = {
    "luoi-ho.jpg": "snake-plant.jpg",
    "kim-tien.jpg": "zz.jpg",
    "truc-may-man.jpg": "lucky-bamboo.jpg",
    "monstera.jpg": "fiddle-leaf-fig.jpg",
    "lan-y.jpg": "peace-lily.jpg",
    "phat-tai.jpg": "lucky-bamboo.jpg",
    "sen-da.jpg": "aloe-vera.jpg",
    "xuong-rong-tai-tho.jpg": "aloe-vera.jpg",
  };

  const normalized = (() => {
    if (src.startsWith("http")) {
      return src;
    }

    const clean = src.replace(/^\/+/, "");

    if (clean.startsWith("images/")) {
      return `${API_BASE_URL.replace(/\/$/, "")}/${clean}`;
    }

    if (clean.startsWith("backend/plants/")) {
      return `/${clean}`;
    }

    const imageName = clean.startsWith("plants/")
      ? clean.slice("plants/".length)
      : clean;
    const mappedName = seedImageFallbacks[imageName] || imageName;

    return `/backend/plants/${mappedName}`;
  })();

  return (
    <div className={`relative overflow-hidden ${className || ""}`}>
      <Image
        src={normalized}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
