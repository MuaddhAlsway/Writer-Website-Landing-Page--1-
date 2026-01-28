import React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  email?: string;
}

export const WelcomeEmail = ({ email }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our newsletter!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Welcome! 🎉</Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Thank you for subscribing to our newsletter!
          </Text>
          <Text style={paragraph}>
            You'll now receive updates and exclusive content directly in your inbox.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © 2026 Author Fatima. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '16px 0',
  color: '#2c3e50',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  color: '#555',
};

const hr = {
  borderColor: '#e5e5e5',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#999',
  margin: '16px 0',
};
