import OurStoryGift from "../page";
export default async function StoryPage({params}){const {id}=await params;return <OurStoryGift giftId={id}/>;}
