import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import Socials from "./socials"
  import { BackButton } from "./back-btn"
  
  type CardWrapperProps = {
    children: React.ReactNode
    cardTitle: string
    backButtonHref: string
    backButtonLabel: string
    showSocials?: boolean
  }
  
  export const AuthCard = ({
    children,
    cardTitle,
    backButtonHref,
    backButtonLabel,
    showSocials,
  }: CardWrapperProps) => {
    return (
      <Card className="px-4 flex flex-col justify-center">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
        {showSocials && (
          <CardFooter>
            <Socials />
          </CardFooter>
        )}
        <CardFooter>
          <BackButton href={backButtonHref} label={backButtonLabel} />
        </CardFooter>
      </Card>
    )
  }
  