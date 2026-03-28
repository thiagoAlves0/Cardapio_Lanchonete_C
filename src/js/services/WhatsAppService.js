// src/js/services/WhatsAppService.js

const PHONE = '5583999048716';

class WhatsAppService {
    constructor(phone = PHONE) {
        this.phone   = phone;
        this.baseURL = 'https://wa.me';
    }

    formatOrder(cart, deliveryOption, address = '', observation = '', orderNumber = 1, paymentMethod = 'Pix') {
        const now    = new Date();
        const time   = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const padded = String(orderNumber).padStart(4, '0');
        const SEP    = '--------------------';

        let message = `*PEDIDO #${padded} \u2014 Lanchonete Central*\n`;
        message    += `Hoje \u00e0s ${time}\n`;
        message    += `${SEP}\n\n`;

        let totalUnits = 0;
        cart.forEach(item => {
            totalUnits += item.quantity;
            message += `*${item.quantity}x* ${item.name}\n`;
            if (item.note && item.note.trim()) {
                message += `  \u21b3 _${item.note.trim()}_\n`;
            }
        });

        const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
        const unit  = totalUnits === 1 ? 'unidade' : 'unidades';

        message += `\n${SEP}\n`;
        message += `*${totalUnits} ${unit} no total*\n`;
        message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
        message += `*PAGAMENTO: ${paymentMethod}*\n`;
        message += `${SEP}\n\n`;

        if (deliveryOption === 'delivery') {
            message += `*ENTREGA*\n${address}\n`;
        } else {
            message += `*RETIRADA NO LOCAL*\n`;
        }

        if (observation.trim()) {
            message += `\n*OBS:* _${observation}_\n`;
        }

        return message;
    }

    sendOrder(cart, deliveryOption, address = '', observation = '', orderNumber = 1, paymentMethod = 'Pix') {
        try {
            const message = this.formatOrder(cart, deliveryOption, address, observation, orderNumber, paymentMethod);
            const url     = `${this.baseURL}/${this.phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
            return true;
        } catch (error) {
            console.error('WhatsAppService: erro ao enviar pedido.', error);
            return false;
        }
    }
}

export default WhatsAppService;