import { Box, Card, CardContent, CardActions, Stack, Chip, Typography } from '@mui/material';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { googlecode as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
				"title": "Gandhi Jayanti: 'If I Was Born A Woman..', When Bapu Opposed Child Marriage, Dowry",
				"url": "https://www.india.com/news/gandhi-jayanti-mahatma-gandhis-views-on-child-marriage-dowry-if-i-was-born-a-woman-top-news-bapu-facts-father-of-the-nation-6371833/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Gandhi Jayanti 2023: Movies That Pay Homage to Mahatma Gandhi",
				"url": "https://www.india.com/entertainment/gandhi-jayanti-2023-movies-that-pay-homage-to-mahatma-gandhi-6371696/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "'I Want My Medal Back': Swapna Barman Makes Scathing Attack After Missing Asiad Bronze",
				"url": "https://www.india.com/sports/asian-games-2023-swapna-barman-womens-hepthlon-transgender-nandini-agasara-bronze-medal-6372189/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Dengue Diet: 5 Immunity-Boosting Drinks to Recover From Viral Infection",
				"url": "https://www.india.com/health/dengue-diet-5-immunity-boosting-drinks-to-recover-from-viral-infection-6372425/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Fukrey 3 BOC Day 4: Biggest Sunday For Richa's Film, to Cross Rs 50 Crore on Gandhi Jayanti",
				"url": "https://www.india.com/entertainment/fukrey-3-box-office-collection-day-4-biggest-sunday-for-richa-chadha-film-to-cross-rs-50-crore-on-gandhi-jayanti-check-detailed-report-6371887/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Gandhi Jayanti Special: 5 Mahatma Gandhi-Approved Diet Tips Gen Z Must Follow",
				"url": "https://www.india.com/lifestyle/gandhi-jayanti-special-5-mahatma-gandhi-approved-diet-tips-gen-z-must-follow-5006061/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Virat Kohli Leaves Indian Team Ahead Of ODI World Cup 2023 Warm-Up Game Vs NED - Reports",
				"url": "https://www.india.com/cricket-2/virat-kohli-leaves-indian-team-ahead-of-odi-world-cup-2023-warm-up-game-vs-netherlands-reports-6371891/",
				"description": "",
				"source": "https://india.com",
				"publishedAt": null,
				"urlToImage": ""
			},
			{
				"title": "Asiad Live: 3rd Ever Medal Won In TT, Usha's Record Equalled In Athletics",
				"url": "https://sports.ndtv.com/asian-games-2023/asian-games-2023-live-october-2-latest-updates-4441462#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-10/3et2bfhg_mukherjee-tt_240x180_02_October_23.jpg?downsize=105:79"
			},
			{
				"title": "Bodies Of 3 Missing Sisters Found Stuffed Inside Trunk In Punjab: Cops",
				"url": "https://www.ndtv.com/india-news/bodies-of-3-missing-sisters-found-stuffed-inside-trunk-in-punjab-cops-4442173#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-02/6o8lk6hg_police-generic_120x90_24_February_23.jpg?downsize=105:79"
			},
			{
				"title": "Promised Good Returns In Bitcoin Trading, Man Cheated Of Rs 77 Lakh: Cops",
				"url": "https://www.ndtv.com/cities/promised-good-returns-in-bitcoin-trading-thane-man-cheated-of-rs-77-lakh-cops-4441854#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-01/jtj5u9mg_bitcoin-scammers_120x90_18_January_23.jpg?downsize=105:79"
			},
			{
				"title": "PM Modi Launches Developmental Projects Worth Rs 7,000 Crore In Rajasthan",
				"url": "https://www.ndtv.com/india-news/pm-modi-launches-developmental-projects-worth-rs-7-000-crore-in-rajasthan-4442071#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-08/b23eao88_pm-modi-pti_120x90_15_August_23.jpg?downsize=105:79"
			},
			{
				"title": "\"Lost My Medal To Transgender\": Alleges Indian Athlete, Then Deletes Post",
				"url": "https://sports.ndtv.com/asian-games-2023/lost-my-medal-to-trans-woman-alleges-indias-swapna-barman-triggers-controversy-4441846#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-10/biglhbtg_swapna-barman_625x300_02_October_23.jpg?im=FeatureCrop,algorithm=dnn,width=105,height=79"
			},
			{
				"title": "Man Sends Nude Pics, Slits Wrist With Blade After Girl, 13, Rejects Him",
				"url": "https://www.ndtv.com/cities/case-against-man-for-harassing-stalking-13-year-old-girl-in-thane-cops-4441825#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2022-11/dp2p6tn4_police-generic_120x90_07_November_22.jpg?downsize=105:79"
			},
			{
				"title": "Cops Sexually Harass Woman In Ghaziabad Park, Extort Money From Fiance",
				"url": "https://www.ndtv.com/ghaziabad-news/22-year-old-woman-sexually-harassed-by-cops-in-ghaziabad-4441781#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2021-09/6cnmrm9o_ghaziabad-police-generic_120x90_01_September_21.jpg?downsize=105:79"
			},
			{
				"title": "\"Shameful\": Elon Musk Accuses Justin Trudeau Of \"Crushing Free Speech\"",
				"url": "https://www.ndtv.com/world-news/elon-musk-justin-trudeau-crushing-free-speech-online-streaming-services-podcasts-registration-compulsory-with-government-4441582#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-09/0m0ncn68_elon-musk_120x90_19_September_23.jpg?downsize=105:79"
			},
			{
				"title": "\"Hope We Get...\": Shadab's 'Ahmedabad Remark' Ahead Of Start Of World Cup",
				"url": "https://sports.ndtv.com/icc-cricket-world-cup-2023/hope-we-get-shadab-khans-ahmedabad-remark-ahead-of-start-of-odi-world-cup-4440691#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-10/hferm8v8_shadab-khan-afp_625x300_02_October_23.jpg?im=FeatureCrop,algorithm=dnn,width=105,height=79"
			},
			{
				"title": "Ghulam Nabi Azad Next Jammu And Kashmir Lt Governor? He Said...",
				"url": "https://www.ndtv.com/india-news/ghulam-nabi-azad-next-jammu-and-kashmir-lt-governor-he-said-4440849#pfrom=home-ndtv_topstories",
				"description": "",
				"source": "https://ndtv.com",
				"publishedAt": null,
				"urlToImage": "https://c.ndtvimg.com/2023-05/o5k2ungg_ghulam-nabi-azad-ani_120x90_24_May_23.jpg?downsize=105:79"
			}
		]
	}
}

function DemoCard({ method, data, url }: DemoCardProps) {
  return (
      <Card variant="outlined" sx={{
                    width: "90%",
                    margin: "1.25rem auto",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(7px)",
                    borderRadius: "10px",
                }}>
          <CardContent  sx={{
                            padding: "0",
                            "&:last-child": {
                                paddingBottom: "0"
                            }
                        }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ padding: "0.75rem", }}>
          <Chip color="success" label={method} />
           <Typography color="grey.600" fontFamily="monospace">{url}</Typography>
        </Stack>

              <SyntaxHighlighter language="json" style={syntaxStyle} customStyle={{ background: "none", margin: 0, overflow: "scroll", maxHeight: "23rem", padding: "0.75rem" }}>
                  {JSON.stringify(exampleData, null, 2)}
              </SyntaxHighlighter>
      </CardContent>
    </Card>
  );
}


export default DemoCard;
