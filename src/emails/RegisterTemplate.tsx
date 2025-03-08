import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Text,
  Font,
} from "@react-email/components";
import { type CSSProperties } from "react";

interface BedtimefableMagicLinkProps {
  loginUrl: string;
}

const baseUrl = process.env.HOST
  ? `https://${process.env.HOST}`
  : "https://clashofapps.com";

const SeoArticlesMagicLink = ({ loginUrl }: BedtimefableMagicLinkProps) => (
  <Html>
    <Head>
      <Font
        fontFamily="Lato"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600&display=swap",
          format: "woff2",
        }}
      />
      <Font
        fontFamily="Josefin Sans"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600&display=swap",
          format: "woff2",
        }}
      />
      <Font
        fontFamily="Acme"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Acme&display=swap",
          format: "woff2",
        }}
      />
    </Head>
    <Body style={styles.body}>
      <Container>
        <div style={styles.container}>
          <Img
            src={`${baseUrl}/logo.png`}
            height="40"
            alt="clashofapps.com"
            style={styles.img}
          />
          <Heading style={styles.heading}>Welcome to clashofapps.com</Heading>
          <Heading style={styles.subheading}>Your magic link is here!</Heading>
          <Link href={loginUrl} style={styles.button}>
            Click here to login to clashofapps.com
          </Link>
          <div style={styles.div}>
            <hr style={styles.hr} />
            <Text style={styles.text}>
              Or Click the following link to finish logging into
              clashofapps.com.
            </Text>
            <Link href={loginUrl} style={styles.loginLink}>
              {loginUrl}
            </Link>
          </div>
          <div style={styles.div}>
            <Text style={styles.subText}>Not expecting this email?</Text>
            <Text style={styles.subText}>
              Contact{" "}
              <Link
                href="mailto:hey@clashofapps.com"
                style={styles.contactLink}
              >
                hey@clashofapps.com
              </Link>{" "}
              if you did not request this code.
            </Text>
          </div>
        </div>
      </Container>
    </Body>
  </Html>
);

const styles: Record<string, CSSProperties> = {
  body: {
    backgroundColor: "hsl(50, 100%, 97%)", // --background (yellow tint)
    fontFamily: "Lato, sans-serif",
    color: "hsl(50, 10%, 10%)", // --foreground (dark yellow-black)
  },
  container: {
    margin: "0 auto",
    marginTop: "20px",
    maxWidth: "360px",
    gap: "1.5rem",
    borderRadius: "0.375rem",
    border: "1px solid hsl(50, 80%, 85%)", // --border (light yellow)
    backgroundColor: "hsl(50, 100%, 98%)", // --card (off-white yellow)
    padding: "4rem 2rem",
    paddingBottom: "2rem",
    boxShadow:
      "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  img: {
    display: "block",
    margin: "0 auto",
  },
  heading: {
    display: "inline-block",
    padding: "16px 0",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginBottom: "0",
    paddingBottom: "0",
    fontFamily: "Josefin Sans, sans-serif",
    color: "hsl(50, 10%, 15%)", // --card-foreground (dark yellow-black)
  },
  subheading: {
    display: "inline-block",
    padding: "16px 0",
    fontSize: "16px",
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    paddingTop: "0",
    marginBottom: "16px",
    color: "hsl(22, 5%, 15%)", // --card-foreground
  },
  button: {
    display: "block",
    margin: "0 auto",
    padding: "16px 16px",
    backgroundColor: "hsl(50, 90%, 50%)", // --primary (bright yellow)
    textAlign: "center",
    color: "hsl(50, 10%, 10%)", // --primary-foreground (dark text for contrast)
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    fontSize: "16px",
    cursor: "pointer",
  },
  div: {
    marginTop: "48px",
  },
  hr: {
    width: "50%",
    margin: "0 auto",
  },
  text: {
    display: "inline-block",
    fontSize: "0.875rem",
    fontWeight: "500",
    lineHeight: "1.5",
    color: "hsl(50, 10%, 15%)", // --card-foreground (dark yellow-black)
    marginTop: "0.5rem",
    textAlign: "center",
  },
  loginLink: {
    display: "block",
    width: "100%",
    fontSize: "0.875rem",
    fontWeight: "bold",
    lineHeight: "1rem",
    color: "hsl(50, 90%, 40%)", // --primary (darker yellow for link)
    textDecoration: "none",
    textAlign: "center",
  },
  subText: {
    display: "inline-block",
    fontSize: "0.75rem",
    lineHeight: "1.5",
    color: "hsl(50, 15%, 40%)", // --muted-foreground (muted yellow-gray)
    marginTop: "0.5rem",
    margin: "0",
  },
  contactLink: {
    color: "hsl(50, 90%, 40%)", // --primary (darker yellow for link)
    textDecoration: "underline",
  },
};

export default SeoArticlesMagicLink;

SeoArticlesMagicLink.PreviewProps = {
  loginUrl: "https://hyperarticle.com/login?code=123456",
};
