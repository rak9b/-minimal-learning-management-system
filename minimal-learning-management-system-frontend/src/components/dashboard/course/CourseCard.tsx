import { Star, Clock, Users, BookOpen } from "lucide-react";

import Link from "next/link";

interface CourseCardProps {
  title: string;
  instructor: string;
  instructorImage: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
}

export default function CourseCard({
  title,
  instructor,
  instructorImage,
  rating,
  reviewCount,
  price,
  originalPrice,
  description,
  category,
}: CourseCardProps) {
  return (
    <Link href="/course/1" className="block">
      <div className="group relative bg-card border border-border rounded-lg shadow-sm hover:shadow-md overflow-hidden">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {category}
          </span>
        </div>

        {/* Instructor Image */}
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={instructorImage || "/placeholder.svg"}
            alt={instructor}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Card Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="font-bold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-primary">
            {title}
          </h3>

          {/* Instructor */}
          <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1">
            <Users className="h-4 w-4" />
            by {instructor}
          </p>

          {/* Description */}
          <p className="text-card-foreground text-sm mb-4 line-clamp-3">
            {description}
          </p>

          {/* Rating and Duration */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-card-foreground">
                {rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({reviewCount.toLocaleString()})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>12h</span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">${price}</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            <button className="bg-primary hover:bg-primary/90 cursor-pointer">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
