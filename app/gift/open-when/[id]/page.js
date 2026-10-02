import OpenWhenGiftPage from "../page";
export default async function GiftPage({params}){const {id}=await params;return <OpenWhenGiftPage giftId={id}/>;}
