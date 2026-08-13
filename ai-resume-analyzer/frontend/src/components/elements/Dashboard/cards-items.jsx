import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function CardsItems({ item }) {
  return (
    <Card className="bg-gradient-to-t from-primary/5 to-card shadow-sm hover:shadow-md transition-all lg:min-w-xs w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            {item?.title ? <CardTitle>{item?.title}</CardTitle> : null}
            <CardDescription className="text-2xl font-semibold tabular-num mt-1">
              {item?.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      {item?.content ? (
        <CardContent className="mt-2">{item?.content}</CardContent>
      ) : null}
      {item?.footerText ? (
        <CardFooter className="flex flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">{item?.footerText}</div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
