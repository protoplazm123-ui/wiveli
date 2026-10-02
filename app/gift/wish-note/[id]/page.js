import WishNoteGift from "../page";
export default async function GiftPage({params}) {
  const {id}=await params;
  return <WishNoteGift giftId={id}/>;
}
