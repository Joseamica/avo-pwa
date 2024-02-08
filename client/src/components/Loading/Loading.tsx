import { MutatingDots } from 'react-loader-spinner'
import { H2 } from '../Util/Typography'
import { Flex } from '../Util/Flex'

// function Loading() {
//   return (
//     <FullSizeCenteredFlexBox>
//       <CircularProgress />
//     </FullSizeCenteredFlexBox>
//   );
// }

function Loading({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-screen bg-white opacity-75">
      <Flex direction="col" align="center">
        <MutatingDots
          visible={true}
          height="100"
          width="100"
          color="#003366"
          secondaryColor="#0055A4"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
        <H2>{message}...</H2>
      </Flex>
    </div>
  )
}

export default Loading
