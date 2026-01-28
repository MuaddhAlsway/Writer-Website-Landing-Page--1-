import React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NewsletterEmailProps {
  title: string;
  content: string;
}

export const NewsletterEmail = ({ title, content }: NewsletterEmailProps) => {
  // Convert HTML content or plain text
  const htmlContent = content.includes('<') 
    ? content 
    : `<p>${content.replace(/\n/g, '</p><p>')}</p>`;

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Text style={heading}>{title}</Text>
            <Hr style={hr} />
            <Section
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={contentStyle}
            />
            <Hr style={hr} />
            <Text style={footer}>
              © 2026 Author Fatima. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

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

const contentStyle = {
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
