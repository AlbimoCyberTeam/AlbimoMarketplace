export function applyVoucher(
kode,
total
){

const vouchers = {
HEMAT10 : 10,
PROMO20 : 20
};

if(vouchers[kode]){

const diskon =
(total * vouchers[kode]) / 100;

return {
success:true,
totalBaru: total - diskon
};

}

return {
success:false
};

}