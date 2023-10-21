import {
  Box,
  Card,
  CardContent,
  CardActions,
  Stack,
  Chip,
  Typography,
} from "@mui/material";

import SyntaxHighlighter from "react-syntax-highlighter";
import { googlecode as syntaxStyle } from "react-syntax-highlighter/dist/esm/styles/hljs";

interface DemoCardProps {
  method: string;
  data?: any;
  url: string;
}

const exampleData = {
    "status": "success",
    "message": "Headlines fetched successfully.",
    "data": {
        "headlines": [
            {
                "title": "Indian Man Cheats US Citizen Of Cryptocurrency Worth Crores, Caught By CBI",
                "url": "https://www.ndtv.com/india-news/online-fraud-against-us-citizen-cryptocurrency-worth-usd-930-000-seized-by-cbi-from-ahmedabad-based-man-4501989#pfrom=home-ndtv_topstories",
                "urlToImage": "https://c.ndtvimg.com/2023-07/4l8a7t6o_cbi_120x90_21_July_23.jpg",
                "source": "ndtv.com",
                "description": "The CBI has seized cryptocurrency worth more than $930,000 (around ₹ 7.7 crore) from an Ahmedabad-based man who allegedly cheated a US-citizen posing as a senior executive of a multi-national company's fraud department, officials said.&nbsp; Based on inputs from the Federal Bureau of Investigation (FBI) of the United States, the CBI filed an FIR against Ramavat Shaishav, who allegedly contacted the US citizen over the phone and introduced himself as \"James Carlson\" from the fraud department of Amazon, they said. \"It was also alleged that the accused induced the victim to withdraw cash from his bank accounts and deposit the same in Bitcoin in the RockitCoin ATM Wallet, and also shared a QR code falsely informing him (the victim) that the same was opened by the US Treasury for him,\" the Central Bureau of Investigation's (CBI) spokesperson said. It is alleged that to gain the victim's trust, Shaishav e-mailed a forged letter, dated September 20, 2022, claiming it was issued by the US' Federal Trade Commission. \"In pursuance of the said inducement, the victim allegedly withdrew an amount of $130,000 from his bank accounts on different dates during the period August 30, 2022, to September 9, 2022, and deposited the same in the Bitcoin address provided by the accused,\" the official said. This amount was allegedly misappropriated by Shaishav.&nbsp; \"Searches were conducted at the premises of the accused in Ahmedabad which led to the recovery and seizure of cryptocurrencies viz, Bitcoin, Ethereum,&nbsp;Ripple, USDT, etc. worth $939,000 (approximately) from the crypto wallets of the accused, and incriminating material,\" the spokesperson said.",
                "publishedAt": "2023-10-21T07:26:00.000Z"
            },
            {
                "title": "Will India Be Impacted By Israel-Hamas War? Political Scientist Explains",
                "url": "https://www.ndtv.com/india-news/israel-hamas-war-ndtv-exclusive-will-india-be-impacted-by-israel-hamas-war-political-scientist-ian-bremmer-explains-4502011#pfrom=home-ndtv_topstories",
                "urlToImage": "https://c.ndtvimg.com/2023-10/2vsiepes_ian-bremmer-ndtv_120x90_21_October_23.jpg",
                "source": "ndtv.com",
                "description": "The world is starkly divided on the issue with the emerging geopolitical faultlines further getting solidified. While the US and the UK have backed Israel to do everything in their power to tackle Hamas, China and Russia have spoken out in favour of the Palestinian people. \"A ground war is going to happen. It is a bad idea for many reasons. It will kill enormous number of Palestinian civilians, it will be done in short order or without aid for the Palestinians to evacuate. It will lead to backlash around the world,\" Mr Bremmer tells NDTV. Elaborating on how India is moving ahead in a new direction under PM Modi, Mr Bremmer said, \"PM Modi continues to be seen as someone who wants to be aligned with the West and not the Chinese, not the Russians on geopolitical issues. These are incremental steps, not an alliance, but it's nonetheless a clear direction.\" Earlier, Israeli author Yuval Noah Harari had also spoken about the immense leverage that India has in the global order. Speaking to NDTV's Sonia Singh, Mr Harari said, \"It (India) is a democracy. It is committed, unlike Russia or China. It is committed to democratic ideals. But it has good relations with many of these countries and also with Iran. So hopefully India will use whatever leverage it has on countries like Iran to de-escalate, first of all, to prevent further escalation of the conflict.\" Gaza has been under complete seige since Israel launched retaliatory strikes to the terror attack on October 7. Israel's military campaign has levelled entire city blocks in Gaza, killing 4,137 Palestinians, mostly civilians, according to the Hamas-run health ministry.",
                "publishedAt": "2023-10-21T06:43:00.000Z"
            },
        ]
    }
}

function DemoCard({ method, data, url }: DemoCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "90%",
        margin: "1.25rem auto",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(25px)",
        borderRadius: "10px",
      }}
    >
      <CardContent
        sx={{
          padding: "0",
          "&:last-child": {
            paddingBottom: "0",
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ padding: "0.75rem" }}
        >
          <Chip color="success" label={method} />
          <Typography color="grey.600" fontFamily="monospace">
            {url}
          </Typography>
        </Stack>

        <SyntaxHighlighter
          language="json"
          style={syntaxStyle}
          customStyle={{
            background: "none",
            margin: 0,
            overflow: "scroll",
            maxHeight: "23rem",
            padding: "0.75rem",
          }}
        >
          {JSON.stringify(exampleData, null, 2)}
        </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
}

export default DemoCard;
