const limitRequestsPerSecond = async (requests: number, count: number, sendRequestAsync: (i:number) => {}) => {
    let limitRequestPerSecond = count;
    let requestArr: any = [];

    // Сбрасываем счетчик каждую секунду
    const resetCounter = () => {
        limitRequestPerSecond = count;
    };

    setInterval(resetCounter, 1000);

    for (let i = 0; i <= requests; i++) {
        const sendPromise: Promise<string> = sendRequestAsync(i);

        sendPromise.then(() => {
            requestArr = requestArr.filter((promise) => promise !== sendPromise);
        });

        requestArr.push(sendPromise);
        // Если превышено ограничение запросов в секунду, ждем
        while (limitRequestPerSecond <= 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        limitRequestPerSecond--; // Уменьшаем счетчик запросов в секунду


        // Если в массиве больше 10 промисов, ждем завершения всех
        if (requestArr.length >= count) {
            await Promise.race(requestArr);
        }
    }
};

export default limitRequestsPerSecond;