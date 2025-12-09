export function getPregnancyMessage(week: number): string {
  if (week <= 4)
    return `You’re in the very early stages of pregnancy — your baby is just a tiny cluster of cells! 
    You may not even realize you’re pregnant yet, but your body is already hard at work preparing for this journey. 
    It’s a good time to rest, eat well, and start thinking about prenatal vitamins.`;
  else if (week <= 8)
    return `You’re in the second month! Your baby’s heart is beating, and tiny arms and legs are forming. 
    You might feel tired or a bit emotional — totally normal as hormones rise. 
    Try to eat small, frequent meals and stay hydrated to help manage nausea.`;
  else if (week <= 12)
    return `You’re reaching the end of your first trimester! 
    The risk of miscarriage decreases significantly after this point. 
    Your baby now has all their major organs, and your body might start showing subtle changes. 
    Energy levels may begin to improve soon — hang in there!`;
  else if (week <= 16)
    return `You’re now in your second trimester — often called the “golden period.” 
    Morning sickness may fade, and you might feel more energetic. 
    Your baby is developing facial expressions and can now make tiny movements, even if you can’t feel them yet.`;
  else if (week <= 20)
    return `You’re halfway through your pregnancy! 
    You may begin to feel gentle flutters — your baby’s first movements. 
    Their organs are developing fast, and you might have your anatomy scan around this time. 
    Don’t forget to keep yourself hydrated and take short walks if you can.`;
  else if (week <= 24)
    return `Your baby is growing quickly — about the size of an ear of corn now! 
    Their hearing is improving, and they can recognize your voice. 
    You might feel back pain or leg cramps, so gentle stretches and rest will help.`;
  else if (week <= 28)
    return `Welcome to the third trimester! 
    Your baby’s lungs and brain are developing rapidly. 
    You may notice stronger kicks and need to rest more often. 
    It’s a great time to start planning for birth and packing your hospital bag.`;
  else if (week <= 32)
    return `You’re in the home stretch! 
    Your baby is gaining fat and developing sleep cycles. 
    You might feel a bit breathless as your uterus expands. 
    Take it slow, eat iron-rich foods, and remember to practice self-care daily.`;
  else if (week <= 36)
    return `You’re getting close — your baby is almost full term! 
    You might feel pelvic pressure as your baby moves lower. 
    Braxton Hicks contractions can start now — they’re your body’s way of getting ready for labor.`;
  else if (week <= 38)
    return `Your baby could arrive anytime in the next few weeks! 
    They’re considered full-term now. 
    Rest as much as possible, prepare your hospital essentials, and enjoy these final moments of anticipation.`;
  else if (week <= 40)
    return `You’re probably feeling like you want to get this baby OUT! 
    The impatience and discomfort you’re feeling are normal — your body is fully prepared for birth. 
    Take deep breaths, go for gentle walks, and trust the process — your baby will arrive soon.`;
  else
    return `You’ve reached or passed your due date — what an incredible journey! 
    Some babies just need a little extra time. 
    Keep in touch with your doctor, rest as much as possible, and know that your body is doing exactly what it’s meant to. 
    You’re about to meet your little miracle any day now.`;
}
