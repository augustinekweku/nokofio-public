import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const questions = [
  {
    id: 1,
    question: "What is Nokofio?",
    answer:
      "Nokofio is a tips, donations and general link-in-bio platform that allows users to easily and conveniently give monetary tips or make donations to content creators, organizations, or individuals. Nokofio provides a way for users to support the work of their favorite creators, organizations, or individuals, and to help make a positive impact in the world",
  },
  {
    id: 2,
    question: "How do I use Nokofio?",
    answer:
      "To use Nokofio, you will first need to create an account. This can be done through the Nokofio.me website or the app. Once your account is set up, you can link it to a settlement account method, such as MoMo or bank account. You can then share your Nokofio link to your audience through social media, and receive payments from your audience.",
  },
  {
    id: 3,
    question:
      'Can I use Nokofio to create a "donate" or "support" link in my bio?',
    answer:
      'Yes, one of the key features of Nokofio is the ability to easily create a "donate" or "support" link that can be included in your bio on social media platforms. This allows your followers to easily and conveniently make financial contributions to support your work, or to make donations to organizations or individuals of your choice.',
  },
  {
    id: 4,
    question: "Is Nokofio safe?",
    answer:
      "Yes, Nokofio takes data security very seriously and uses secure payment systems to protect your financial information. We are committed to providing a safe and secure platform for users to collect contributions.",
  },
  {
    id: 5,
    question: "I have a question, how do i contact you?",
    answer: "You can contact us via email at support@nokofio.me or call +233544108998",
  },
  {
    id: 6,
    question: "Are there fees associated with using Nokofio?",
    answer:
      "Yes, there are fees associated with using Nokofio. These fees include transaction fees for processing payments, as well as other types of fees for things like account maintenance or special features. Please refer to our terms and conditions for more information on our fees.",
  },
  {
    id: 7,
    question: "Is there a Mobile App for Nokofio?",
    answer:
      "Yes, Search 'Nokofio' Google PlayStore or Apple AppStore to download.",
  },
  {
    id: 8,
    question: "How will I receive my funds accumulated?",
    answer:
      "You can receive your funds through MoMo or bank account in 24 hours after you have linked your account to a settlement account method.",
  },
  {
    id: 9,
    question: "Can i create more than one Bio link?",
    answer:
      "Yes, you can create as many bio links as you want. You can also create a bio link for a specific cause or organization.",
  },
];

export default function Faqs() {
  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      {questions.map((item, i) => (
        <Accordion key={i}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
