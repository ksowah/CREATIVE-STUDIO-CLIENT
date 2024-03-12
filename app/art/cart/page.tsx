import Container from "@/components/Container";
import Header from "@/components/Header";
import CreativeCard from "@/components/CreativeCard";
import Footer from "@/components/Footer";



const CartPage = () => {
  return (
    <main>
      <Header />
      <Container>
        <div className="pt-[7rem] ">
          <div className="h-[25rem] bg-white border-2 border-[#bdbcco] border-solid	rounded-[10px] ">
            <div className="flex flex-col justify-center items-center mt-16 ">
            <img src="/images/shoppingcart.png" width={120}/>
            <p className="text-[#5c5b66] font-semibold text-[15px] mt-5">Ooops! Your cart is empty</p>
            <p className="text-[13px] my-5">It’s worth every penny spent on an artwork!</p>
            <button className="bg-[#000] text-[#fff] text-[13px] rounded-[5px] p-2 h-[35px] w-[130px]">START SHOPPING</button>
            </div>
          </div>
          
          <h3 className="text-center my-10 text-[25px]">Top Selling</h3>

          <div className="flex justify-evenly flex-wrap"> 
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="John Doe" workImage="/images/art1.svg" designId="1" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Kelvin Sowah" workImage="/images/art2.svg" designId="2" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Paul Israel" workImage="/images/art3.svg" designId="3" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Nukpezah Winfred" workImage="/images/art4.svg" designId="4" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Kofi Doe" workImage="/images/art5.svg" designId="5" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Jane Doe" workImage="/images/art6.svg" designId="6" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Jane Doe" workImage="/images/art7.svg" designId="6" />
            <CreativeCard authourImage="/images/profilepic1.svg" authourName="Jane Doe" workImage="/images/art8.svg" designId="6" />
          </div>
          <Footer />
        </div>
      </Container>
    </main>
  );
};

export default CartPage;
