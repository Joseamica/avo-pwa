import api from '@/axiosConfig'
import { Flex } from '@/components'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { Spacer } from '@/components/Util/Spacer'
import { H2, H3, H4, H6, H7 } from '@/components/Util/Typography'
import ErrorMessage from '@/pages/Error/ErrorMessage'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FaCameraRetro, FaInstagram } from 'react-icons/fa'
import { MdAdsClick } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'

interface Menu {
  id: number
  name: string
  imageUrl: string
}

export default function Menus() {
  const params = useParams()

  const [showImageMenu, setShowImageMenu] = useState(true)

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ['menus', params],
    queryFn: async () => {
      const response = await api.get(`/v1/venues/${params.venueId}/menus`)
      return response.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour in ms
    gcTime: 1000 * 60 * 60 * 24, // 24 hours in ms
    refetchOnWindowFocus: false, // Disables automatic refetching when browser window is focused.
  })

  if (isLoading) return <Loading message="Cargando el menu..." />
  if (isError) return <ErrorMessage responseError={error.message} />

  return (
    <div className="w-full max-w-lg pb-3 mx-auto">
      <Flex className="sticky top-0 z-40 p-4 bg-white shadow rounded-b-3xl" align="center" justify="between">
        <Flex align="center" space="xs" className="bg-white">
          <Link
            to={`/venues/${params.venueId}/bills/${params.billId}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-background-primary "
          >
            <ChevronLeft />
          </Link>
          <H2>Carta</H2>
        </Flex>
        <button
          className="flex flex-row items-center justify-center px-3 py-2 space-x-2 text-xs border rounded-full bg-background-primary border-buttons-main w-52"
          onClick={() => setShowImageMenu(!showImageMenu)}
        >
          {showImageMenu ? <MdAdsClick className="w-5 h-5 fill-violet-500" /> : <FaCameraRetro className="w-5 h-5 fill-sky-500" />}
          <span>{showImageMenu ? 'Mostrar carta interactiva' : 'Mostrar carta en foto'}</span>
        </button>
      </Flex>
      <Spacer size="sm" />
      {showImageMenu ? (
        <div>
          {data.menus?.map((menu: Menu) => {
            return (
              <div key={menu.id}>
                {/* <h1>{menu.name}</h1> */}
                <img loading="lazy" src={menu.imageUrl} alt={menu.name} width="500" height="500" className="rounded-xl" />
              </div>
            )
          })}
        </div>
      ) : (
        <AvoqadoMenu avoqadoMenus={data.avoqadoMenus} />
      )}
    </div>
  )
}

const AvoqadoMenu = ({ avoqadoMenus }: { avoqadoMenus: any }) => {
  const [showProduct, setShowProduct] = useState({
    show: false,
    product: {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      calories: 0,
      instagramUrl: '',
    },
  })

  return (
    <div className="p-4">
      {/* <h1>Menu de avoqado</h1> */}
      {/* <img src={avoqadoMenus.imageUrl} alt={avoqadoMenus.name} width="500" height="500" className="rounded-xl" /> */}
      <div className="space-y-4">
        {avoqadoMenus.categories.map((category: any) => {
          return (
            <div key={category.id} className="">
              <H4 className="uppercase text-violet-500">{category.name}</H4>
              <Spacer size="xs" />
              <div className="space-y-2">
                {category.avoqadoProducts.map((avoqadoProduct: any) => {
                  return (
                    <button
                      key={avoqadoProduct.id}
                      className="relative flex flex-row items-center justify-between w-full text-start"
                      onClick={() =>
                        setShowProduct({
                          show: true,
                          product: {
                            id: avoqadoProduct.id,
                            name: avoqadoProduct.name,
                            description: avoqadoProduct.description,
                            price: avoqadoProduct.price,
                            imageUrl: avoqadoProduct.imageUrl,
                            calories: avoqadoProduct.calories,
                            instagramUrl: avoqadoProduct.instagramUrl,
                          },
                        })
                      }
                    >
                      <Flex direction="col" className="max-h-20">
                        <div className="absolute w-[3px] h-full rounded-full bg-buttons-main -left-2" />
                        {/* <img src={avoqadoProduct.imageUrl} alt={avoqadoProduct.name} width="50" height="50" className="rounded-xl" /> */}
                        <H6 bold="medium">{avoqadoProduct.name}</H6>
                        <H7 variant="secondary" className="text-clip">
                          {avoqadoProduct.description}
                        </H7>
                      </Flex>
                      <div className="ml-10 text-end ">
                        <H6 bold="light">${avoqadoProduct.price}</H6>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <Modal
        isOpen={showProduct.show}
        title={showProduct.product.name}
        closeModal={() =>
          setShowProduct({
            show: false,
            product: {
              id: 0,
              name: '',
              description: '',
              price: 0,
              imageUrl: '',
              calories: 0,
              instagramUrl: '',
            },
          })
        }
      >
        <img src={showProduct.product.imageUrl} alt={showProduct.product.name} className="object-cover " />
        <div className="flex flex-col px-4 pb-8 text-center">
          {/* <H2>{showProduct.product.name}</H2> */}

          <Spacer size="sm" />
          <H2 variant="secondary">{showProduct.product.description}</H2>
          <Spacer size="sm" />
          <Flex direction="col" justify="between" align="center" space="xs">
            <H3 bold="medium">${showProduct.product.price}</H3>
            <H3 bold="medium">{showProduct.product.calories} cal.</H3>
            {showProduct.product.instagramUrl && (
              <button onClick={() => window.open(showProduct.product.instagramUrl, '_blank')}>
                <FaInstagram className="w-10 h-10" />
              </button>
            )}
          </Flex>
        </div>
      </Modal>
    </div>
  )
}
